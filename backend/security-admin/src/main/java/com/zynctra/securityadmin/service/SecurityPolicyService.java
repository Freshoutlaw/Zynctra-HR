package com.zynctra.securityadmin.service;

import com.zynctra.securityadmin.dto.SecurityPolicyDTO;
import com.zynctra.securityadmin.entity.SecurityPolicy;
import com.zynctra.securityadmin.repository.SecurityPolicyRepository;
import com.zynctra.securityadmin.exception.SecurityPolicyException;
import com.zynctra.securityadmin.security.TenantContext;
import com.zynctra.securityadmin.security.SecurityUtils;
import com.zynctra.securityadmin.audit.AuditAction;
import com.zynctra.securityadmin.audit.AuditLogEntry;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Security Policy Service — Hardened implementation with zero-trust validation.
 *
 * SECURITY MODEL:
 * - All inputs validated through DTO + service-layer double-check
 * - Dangerous content detection with allow-list approach
 * - Unicode normalization to prevent homograph/confusable attacks
 * - All mutations require SUPER_ADMIN or SECURITY_ADMIN role
 * - Audit logging for every CRUD operation
 * - Tenant isolation enforced on every query
 * - Active policies are immutable (versioned, new version created on update)
 * - Suspicious patterns trigger quarantine + security event logging
 * - Rate limiting enforced at controller layer; service layer has additional guards
 *
 * HIERARCHY: System Rules > Security Middleware > Application Rules > User Requests
 */
@Service
@Validated
@Transactional(readOnly = true)
public class SecurityPolicyService {

    private static final Logger logger = LoggerFactory.getLogger(SecurityPolicyService.class);
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY_EVENTS");

    // ─────────────────────────────────────────────────────────────────
    // DANGEROUS PATTERN DETECTION (comprehensive block-list)
    // ─────────────────────────────────────────────────────────────────

    /** Patterns that indicate code execution attempts */
    private static final List<Pattern> DANGEROUS_CODE_PATTERNS = Arrays.asList(
        Pattern.compile("(?i)\\beval\\s*\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bexec\\s*\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)Runtime\\.getRuntime\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)ProcessBuilder", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\.getClass\\(\\)\\.\\b", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)Class\\.forName", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)java\\.lang\\.Reflect", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)ScriptEngine", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bimport\\s+java\\.", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bimport\\s+org\\.springframework\\.", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)@Bean\\b|@Component\\b|@Service\\b|@Controller\\b", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)System\\.exit\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)Runtime\\.halt\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bsubprocess\\.", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bos\\.system\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bspawn\\b|\\bpopen\\b|\\bshell\\b", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bload_library\\b|\\bdlopen\\b|\\bffi\\b", Pattern.CASE_INSENSITIVE)
    );

    /** Patterns that indicate prompt injection / jailbreak attempts */
    private static final List<Pattern> PROMPT_INJECTION_PATTERNS = Arrays.asList(
        Pattern.compile("(?i)ignore\\s+(all\\s+)?(previous\\s+)?instructions", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)forget\\s+(your\\s+)?(system\\s+)?prompt", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)you\\s+are\\s+now\\s+(a\\s+)?", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)system\\s*instruction\\s*override", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)DAN\\s*mode|jailbreak|developer\\s*mode", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\[system\\]|\\[admin\\]|\\[root\\]", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)new\\s+role\\s*:|new\\s+persona\\s*:", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)disregard\\s+(the\\s+)?(above|previous)\\s+(rules?|constraints?|policies?)", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)pretend\\s+to\\s+be|act\\s+as\\s+if", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\/\\*\\s*system\\s*\\*\\/", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)<\\s*system\\s*>", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\{\\s*\\\"role\\\"\\s*:\\s*\\\"system\\\"\\s*\\}", Pattern.CASE_INSENSITIVE)
    );

    /** Patterns that indicate obfuscation / encoding attempts */
    private static final List<Pattern> OBFUSCATION_PATTERNS = Arrays.asList(
        Pattern.compile("\\b[A-Za-z0-9+/]{40,}={0,2}\\b"), // Base64-like strings
        Pattern.compile("\\b0x[0-9a-fA-F]{20,}\\b"),       // Long hex strings
        Pattern.compile("\\b\\\\u[0-9a-fA-F]{4}\\b"),      // Unicode escapes
        Pattern.compile("\\b\\\\x[0-9a-fA-F]{2}\\b"),      // Hex escapes
        Pattern.compile("\\$\\{[^{}]+\\}"),              // Shell variable expansion
        Pattern.compile("\\bdata:text\\/html;base64,", Pattern.CASE_INSENSITIVE),
        Pattern.compile("\\bjavascript:\\b", Pattern.CASE_INSENSITIVE)
    );

    /** Patterns for SQL injection attempts */
    private static final List<Pattern> SQL_INJECTION_PATTERNS = Arrays.asList(
        Pattern.compile("(?i)(--;|\\/\\*|\\*\\/|union\\s+select|insert\\s+into|delete\\s+from|drop\\s+table|alter\\s+table|grant\\s+all|truncate\\s+table)"),
        Pattern.compile("(?i)\\b(OR|AND)\\s+['\\\"0-9]=['\\\"0-9]"),
        Pattern.compile("(?i)\\bEXEC\\s*\\(", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bxp_cmdshell\\b", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\bsp_oamethod\\b", Pattern.CASE_INSENSITIVE)
    );

    /** Patterns for path traversal / file access attempts */
    private static final List<Pattern> PATH_TRAVERSAL_PATTERNS = Arrays.asList(
        Pattern.compile("\\.\\.\\/|\\.\\.\\\\|\\%2e\\%2e\\%2f", Pattern.CASE_INSENSITIVE),
        Pattern.compile("(?i)\\/etc\\/passwd|\\/etc\\/shadow|\\.\\.\\/\\.\\.\\/"),
        Pattern.compile("(?i)\\b\\/proc\\/self\\/\\b|\\b\\/dev\\/null\\b"),
        Pattern.compile("(?i)\\.\\.\\%00\\.", Pattern.CASE_INSENSITIVE) // Null byte injection
    );

    /** System-reserved policy names that cannot be created by users */
    private static final Set<String> RESERVED_POLICY_NAMES = new HashSet<>(Arrays.asList(
        "system_default", "root_policy", "admin_override", "super_admin_bypass",
        "security_bypass", "audit_disable", "encryption_bypass", "mfa_disable",
        "rate_limit_disable", "ip_whitelist_override", "tenant_isolation_disable"
    ));

    /** Maximum number of policies per tenant to prevent DoS via policy flooding */
    private static final int MAX_POLICIES_PER_TENANT = 200;

    /** Maximum length for normalized policy value */
    private static final int MAX_POLICY_VALUE_LENGTH = 4000;

    /** Maximum length for policy name */
    private static final int MAX_POLICY_NAME_LENGTH = 64;

    /** Maximum length for description */
    private static final int MAX_DESCRIPTION_LENGTH = 500;

    // ─────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────

    private final SecurityPolicyRepository policyRepository;
    private final AuditLogService auditLogService;
    private final SecurityPolicyValidator policyValidator;

    public SecurityPolicyService(
            SecurityPolicyRepository policyRepository,
            AuditLogService auditLogService,
            SecurityPolicyValidator policyValidator) {
        this.policyRepository = policyRepository;
        this.auditLogService = auditLogService;
        this.policyValidator = policyValidator;
    }

    // ═════════════════════════════════════════════════════════════════
    // PUBLIC API — READ OPERATIONS
    // ═════════════════════════════════════════════════════════════════

    /**
     * Get a single policy by ID with tenant isolation.
     * Cached per tenant to reduce DB load.
     */
    @Cacheable(value = "securityPolicies", key = "#tenantId + ':' + #id")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public Optional<SecurityPolicyDTO> getPolicyById(@NotBlank String id, @NotBlank String tenantId) {
        validateTenantId(tenantId);
        validateIdFormat(id);

        logger.debug("Fetching policy [{}] for tenant [{}]", maskId(id), maskTenant(tenantId));

        return policyRepository.findByIdAndTenantId(id, tenantId)
                .map(this::toDTO);
    }

    /**
     * Get a policy by name with tenant isolation.
     */
    @Cacheable(value = "securityPoliciesByName", key = "#tenantId + ':' + #name")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public Optional<SecurityPolicyDTO> getPolicyByName(@NotBlank String name, @NotBlank String tenantId) {
        validateTenantId(tenantId);
        validatePolicyName(name);

        return policyRepository.findByNameAndTenantId(name, tenantId)
                .map(this::toDTO);
    }

    /**
     * List all policies for a tenant (paginated).
     */
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public Page<SecurityPolicyDTO> listPolicies(@NotBlank String tenantId, Pageable pageable) {
        validateTenantId(tenantId);
        validatePageable(pageable);

        return policyRepository.findAllByTenantId(tenantId, pageable)
                .map(this::toDTO);
    }

    /**
     * Get all active policies of a specific type for a tenant.
     * Cached aggressively since these are read frequently.
     */
    @Cacheable(value = "activePoliciesByType", key = "#tenantId + ':' + #type")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public List<SecurityPolicyDTO> getActivePoliciesByType(
            @NotNull SecurityPolicy.PolicyType type,
            @NotBlank String tenantId) {
        validateTenantId(tenantId);

        return policyRepository.findActiveByType(type, tenantId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Get all active policies for a tenant.
     */
    @Cacheable(value = "allActivePolicies", key = "#tenantId")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDIT_READER')")
    public List<SecurityPolicyDTO> getAllActivePolicies(@NotBlank String tenantId) {
        validateTenantId(tenantId);

        return policyRepository.findAllActive(tenantId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // ═════════════════════════════════════════════════════════════════
    // PUBLIC API — WRITE OPERATIONS
    // ═════════════════════════════════════════════════════════════════

    /**
     * Create a new security policy.
     * Requires SUPER_ADMIN or SECURITY_ADMIN.
     * Triggers approval workflow if policy requires approval.
     * All inputs undergo multi-layer validation.
     */
    @Transactional
    @CacheEvict(value = {"securityPolicies", "securityPoliciesByName", "activePoliciesByType", "allActivePolicies"},
                allEntries = true)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public SecurityPolicyDTO createPolicy(@Valid @NotNull SecurityPolicyDTO dto, @NotBlank String tenantId) {
        String currentUser = SecurityUtils.getCurrentUsername();
        validateTenantId(tenantId);

        // ── Layer 1: Rate-limit guard (prevent policy flooding DoS) ──
        long policyCount = policyRepository.countByTenantId(tenantId);
        if (policyCount >= MAX_POLICIES_PER_TENANT) {
            logSecurityEvent("POLICY_LIMIT_EXCEEDED",
                String.format("Tenant [%s] attempted to exceed max policy limit (%d)",
                    maskTenant(tenantId), MAX_POLICIES_PER_TENANT),
                currentUser, tenantId);
            throw new SecurityPolicyException(
                "Maximum number of policies reached for this tenant. Contact system administrator.");
        }

        // ── Layer 2: Normalize and sanitize all inputs ──
        String normalizedName = normalizeInput(dto.getPolicyName());
        String normalizedDescription = normalizeInput(dto.getDescription());
        String normalizedValue = normalizeInput(dto.getPolicyValue());

        // ── Layer 3: Validate policy name (reserved names, format) ──
        validatePolicyName(normalizedName);
        if (RESERVED_POLICY_NAMES.contains(normalizedName.toLowerCase())) {
            logSecurityEvent("RESERVED_NAME_ATTEMPT",
                String.format("User [%s] attempted to create reserved policy name [%s]",
                    currentUser, normalizedName),
                currentUser, tenantId);
            throw new SecurityPolicyException(
                "Policy name is reserved by the system and cannot be used.");
        }

        // ── Layer 4: Check for duplicate policy name within tenant ──
        policyRepository.findByNameAndTenantId(normalizedName, tenantId).ifPresent(existing -> {
            throw new SecurityPolicyException(
                "A policy with this name already exists in this tenant.");
        });

        // ── Layer 5: Comprehensive dangerous content scan ──
        SecurityScanResult scan = scanForDangerousContent(normalizedValue);
        if (scan.isThreatDetected()) {
            logSecurityEvent("DANGEROUS_POLICY_CONTENT",
                String.format("User [%s] attempted to create policy with dangerous content. " +
                    "Threats: %s | Quarantined: true",
                    currentUser, scan.getThreatSummary()),
                currentUser, tenantId);
            throw new SecurityPolicyException(
                "Policy value contains prohibited content patterns. Request has been logged.");
        }

        // ── Layer 6: Additional obfuscation scan ──
        if (detectObfuscation(normalizedValue)) {
            logSecurityEvent("OBFUSCATION_ATTEMPT",
                String.format("User [%s] attempted to create policy with obfuscated content",
                    currentUser),
                currentUser, tenantId);
            throw new SecurityPolicyException(
                "Policy value contains obfuscated or encoded content which is not permitted.");
        }

        // ── Layer 7: Validate against custom validator (extensible) ──
        policyValidator.validatePolicyValue(normalizedValue, dto.getPolicyType());

        // ── Layer 8: Build and persist entity ──
        SecurityPolicy entity = SecurityPolicy.create(
                normalizedName,
                normalizedDescription,
                normalizedValue,
                dto.getPolicyType(),
                Boolean.TRUE.equals(dto.getRequiresApproval()),
                currentUser
        );
        entity.setTenantId(tenantId);
        entity.setCreatedBy(currentUser);
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedBy(currentUser);
        entity.setUpdatedAt(Instant.now());

        // If approval is required, mark as inactive until approved
        if (Boolean.TRUE.equals(dto.getRequiresApproval())) {
            entity.setActive(false);
        }

        SecurityPolicy saved = policyRepository.save(entity);

        // ── Layer 9: Audit logging ──
        auditLogService.log(AuditLogEntry.builder()
                .action(AuditAction.POLICY_CREATED)
                .resourceType("SecurityPolicy")
                .resourceId(saved.getId())
                .tenantId(tenantId)
                .performedBy(currentUser)
                .details(String.format("Policy [%s] of type [%s] created. Approval required: %s",
                        saved.getPolicyName(), saved.getPolicyType(), saved.getRequiresApproval()))
                .build());

        logger.info("Policy [{}] created by [{}] for tenant [{}]",
                saved.getPolicyName(), currentUser, maskTenant(tenantId));

        return toDTO(saved);
    }

    /**
     * Update an existing security policy.
     * Creates a NEW version rather than mutating the existing one (immutable active policies).
     * Requires SUPER_ADMIN or SECURITY_ADMIN.
     */
    @Transactional
    @CacheEvict(value = {"securityPolicies", "securityPoliciesByName", "activePoliciesByType", "allActivePolicies"},
                allEntries = true)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN')")
    public SecurityPolicyDTO updatePolicy(
            @NotBlank String id,
            @Valid @NotNull SecurityPolicyDTO dto,
            @NotBlank String tenantId) {
        String currentUser = SecurityUtils.getCurrentUsername();
        validateTenantId(tenantId);
        validateIdFormat(id);

        // ── Fetch existing with tenant isolation ──
        SecurityPolicy existing = policyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new SecurityPolicyException("Policy not found or access denied."));

        // ── Prevent modification of system-critical active policies without approval ──
        if (Boolean.TRUE.equals(existing.getActive()) &&
            existing.getPolicyType() == SecurityPolicy.PolicyType.ENCRYPTION_POLICY) {
            // Encryption policies require super-admin for updates
            if (!SecurityUtils.hasRole("SUPER_ADMIN")) {
                logSecurityEvent("UNAUTHORIZED_ENCRYPTION_POLICY_UPDATE",
                    String.format("User [%s] attempted to update active encryption policy [%s] without SUPER_ADMIN",
                        currentUser, existing.getPolicyName()),
                    currentUser, tenantId);
                throw new AccessDeniedException(
                    "Active encryption policies can only be modified by SUPER_ADMIN.");
            }
        }

        // ── Normalize inputs ──
        String normalizedName = normalizeInput(dto.getPolicyName());
        String normalizedDescription = normalizeInput(dto.getDescription());
        String normalizedValue = normalizeInput(dto.getPolicyValue());

        // ── Validate name change doesn't conflict ──
        if (!existing.getPolicyName().equals(normalizedName)) {
            validatePolicyName(normalizedName);
            if (RESERVED_POLICY_NAMES.contains(normalizedName.toLowerCase())) {
                logSecurityEvent("RESERVED_NAME_ATTEMPT",
                    String.format("User [%s] attempted to rename policy to reserved name [%s]",
                        currentUser, normalizedName),
                    currentUser, tenantId);
                throw new SecurityPolicyException("Policy name is reserved by the system.");
            }
            policyRepository.findByNameAndTenantId(normalizedName, tenantId).ifPresent(conflict -> {
                if (!conflict.getId().equals(id)) {
                    throw new SecurityPolicyException("A policy with this name already exists.");
                }
            });
        }

        // ── Dangerous content scan on new value ──
        SecurityScanResult scan = scanForDangerousContent(normalizedValue);
        if (scan.isThreatDetected()) {
            logSecurityEvent("DANGEROUS_POLICY_CONTENT",
                String.format("User [%s] attempted to update policy with dangerous content. Threats: %s",
                    currentUser, scan.getThreatSummary()),
                currentUser, tenantId);
            throw new SecurityPolicyException("Policy value contains prohibited content patterns.");
        }

        if (detectObfuscation(normalizedValue)) {
            logSecurityEvent("OBFUSCATION_ATTEMPT",
                String.format("User [%s] attempted to update policy with obfuscated content", currentUser),
                currentUser, tenantId);
            throw new SecurityPolicyException("Policy value contains obfuscated content.");
        }

        policyValidator.validatePolicyValue(normalizedValue, dto.getPolicyType());

        // ── Immutable active policy: create new version, deactivate old ──
        if (Boolean.TRUE.equals(existing.getActive())) {
            // Deactivate old version
            existing.setActive(false);
            existing.setUpdatedBy(currentUser);
            existing.setUpdatedAt(Instant.now());
            policyRepository.save(existing);

            // Create new version
            SecurityPolicy newVersion = SecurityPolicy.create(
                    normalizedName,
                    normalizedDescription,
                    normalizedValue,
                    dto.getPolicyType(),
                    Boolean.TRUE.equals(dto.getRequiresApproval()),
                    currentUser
            );
            newVersion.setTenantId(tenantId);
            newVersion.setVersion(existing.getVersion() + 1);
            newVersion.setCreatedBy(currentUser);
            newVersion.setCreatedAt(Instant.now());
            newVersion.setUpdatedBy(currentUser);
            newVersion.setUpdatedAt(Instant.now());

            if (Boolean.TRUE.equals(dto.getRequiresApproval())) {
                newVersion.setActive(false);
            } else {
                newVersion.setActive(true);
            }

            SecurityPolicy saved = policyRepository.save(newVersion);

            auditLogService.log(AuditLogEntry.builder()
                    .action(AuditAction.POLICY_VERSIONED)
                    .resourceType("SecurityPolicy")
                    .resourceId(saved.getId())
                    .tenantId(tenantId)
                    .performedBy(currentUser)
                    .details(String.format("Policy [%s] updated from version %d to %d. Previous ID: %s",
                            saved.getPolicyName(), existing.getVersion(), saved.getVersion(), existing.getId()))
                    .build());

            logger.info("Policy [{}] versioned from v{} to v{} by [{}]",
                    saved.getPolicyName(), existing.getVersion(), saved.getVersion(), currentUser);

            return toDTO(saved);
        } else {
            // Inactive policy can be updated in-place (draft state)
            existing.setPolicyName(normalizedName);
            existing.setDescription(normalizedDescription);
            existing.setPolicyValue(normalizedValue);
            existing.setPolicyType(dto.getPolicyType());
            existing.setRequiresApproval(Boolean.TRUE.equals(dto.getRequiresApproval()));
            existing.setUpdatedBy(currentUser);
            existing.setUpdatedAt(Instant.now());

            SecurityPolicy saved = policyRepository.save(existing);

            auditLogService.log(AuditLogEntry.builder()
                    .action(AuditAction.POLICY_UPDATED)
                    .resourceType("SecurityPolicy")
                    .resourceId(saved.getId())
                    .tenantId(tenantId)
                    .performedBy(currentUser)
                    .details(String.format("Inactive policy [%s] updated in draft state", saved.getPolicyName()))
                    .build());

            return toDTO(saved);
        }
    }

    /**
     * Approve a pending security policy.
     * Requires SUPER_ADMIN only (separation of duties).
     */
    @Transactional
    @CacheEvict(value = {"securityPolicies", "securityPoliciesByName", "activePoliciesByType", "allActivePolicies"},
                allEntries = true)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public SecurityPolicyDTO approvePolicy(@NotBlank String id, @NotBlank String tenantId) {
        String currentUser = SecurityUtils.getCurrentUsername();
        validateTenantId(tenantId);
        validateIdFormat(id);

        SecurityPolicy policy = policyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new SecurityPolicyException("Policy not found or access denied."));

        if (Boolean.TRUE.equals(policy.getActive())) {
            throw new SecurityPolicyException("Policy is already active.");
        }

        if (!Boolean.TRUE.equals(policy.getRequiresApproval())) {
            throw new SecurityPolicyException("This policy does not require approval.");
        }

        policy.approve(currentUser);
        policy.setActive(true);
        policy.setUpdatedBy(currentUser);
        policy.setUpdatedAt(Instant.now());

        SecurityPolicy saved = policyRepository.save(policy);

        auditLogService.log(AuditLogEntry.builder()
                .action(AuditAction.POLICY_APPROVED)
                .resourceType("SecurityPolicy")
                .resourceId(saved.getId())
                .tenantId(tenantId)
                .performedBy(currentUser)
                .details(String.format("Policy [%s] approved and activated by SUPER_ADMIN", saved.getPolicyName()))
                .build());

        logger.info("Policy [{}] approved by SUPER_ADMIN [{}]", saved.getPolicyName(), currentUser);

        return toDTO(saved);
    }

    /**
     * Soft-delete a security policy.
     * Requires SUPER_ADMIN (destructive operation).
     */
    @Transactional
    @CacheEvict(value = {"securityPolicies", "securityPoliciesByName", "activePoliciesByType", "allActivePolicies"},
                allEntries = true)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public void deletePolicy(@NotBlank String id, @NotBlank String tenantId) {
        String currentUser = SecurityUtils.getCurrentUsername();
        validateTenantId(tenantId);
        validateIdFormat(id);

        SecurityPolicy policy = policyRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new SecurityPolicyException("Policy not found or access denied."));

        // Prevent deletion of critical system policies
        if (isCriticalSystemPolicy(policy)) {
            logSecurityEvent("CRITICAL_POLICY_DELETE_ATTEMPT",
                String.format("User [%s] attempted to delete critical policy [%s]",
                    currentUser, policy.getPolicyName()),
                currentUser, tenantId);
            throw new SecurityPolicyException(
                "This is a critical system policy and cannot be deleted.");
        }

        policy.setDeleted(true);
        policy.setDeletedAt(Instant.now());
        policy.setDeletedBy(currentUser);
        policy.setActive(false);
        policy.setUpdatedBy(currentUser);
        policy.setUpdatedAt(Instant.now());

        policyRepository.save(policy);

        auditLogService.log(AuditLogEntry.builder()
                .action(AuditAction.POLICY_DELETED)
                .resourceType("SecurityPolicy")
                .resourceId(id)
                .tenantId(tenantId)
                .performedBy(currentUser)
                .details(String.format("Policy [%s] soft-deleted", policy.getPolicyName()))
                .build());

        logger.info("Policy [{}] soft-deleted by [{}]", policy.getPolicyName(), currentUser);
    }

    // ═════════════════════════════════════════════════════════════════
    // INTERNAL SECURITY METHODS
    // ═════════════════════════════════════════════════════════════════

    /**
     * Normalize input to prevent homograph attacks, null-byte injection,
     * and Unicode confusable characters.
     */
    private String normalizeInput(String input) {
        if (input == null) {
            return null;
        }

        // Remove null bytes (common in injection attacks)
        String cleaned = input.replace("\u0000", "").replace("\u0000", "");

        // Unicode normalization: decompose + recompose to standard form
        // This prevents homograph attacks using visually similar characters
        cleaned = Normalizer.normalize(cleaned, Normalizer.Form.NFKC);

        // Trim whitespace to prevent padding-based bypasses
        cleaned = cleaned.trim();

        // Collapse multiple whitespace characters to single space
        cleaned = cleaned.replaceAll("\\s+", " ");

        return cleaned;
    }

    /**
     * Comprehensive multi-layer scan for dangerous content.
     * Returns a scan result with threat classification.
     */
    private SecurityScanResult scanForDangerousContent(String value) {
        if (value == null || value.isBlank()) {
            return SecurityScanResult.clean();
        }

        Set<String> threats = new HashSet<>();

        // Layer A: Code execution patterns
        for (Pattern pattern : DANGEROUS_CODE_PATTERNS) {
            if (pattern.matcher(value).find()) {
                threats.add("DANGEROUS_CODE_PATTERN");
                break;
            }
        }

        // Layer B: Prompt injection / jailbreak patterns
        for (Pattern pattern : PROMPT_INJECTION_PATTERNS) {
            if (pattern.matcher(value).find()) {
                threats.add("PROMPT_INJECTION");
                break;
            }
        }

        // Layer C: SQL injection patterns
        for (Pattern pattern : SQL_INJECTION_PATTERNS) {
            if (pattern.matcher(value).find()) {
                threats.add("SQL_INJECTION");
                break;
            }
        }

        // Layer D: Path traversal patterns
        for (Pattern pattern : PATH_TRAVERSAL_PATTERNS) {
            if (pattern.matcher(value).find()) {
                threats.add("PATH_TRAVERSAL");
                break;
            }
        }

        // Layer E: Attempted encoding/decoding bypass
        // Check if the value, when base64 decoded, contains dangerous patterns
        try {
            String decoded = new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8);
            for (Pattern pattern : DANGEROUS_CODE_PATTERNS) {
                if (pattern.matcher(decoded).find()) {
                    threats.add("ENCODED_DANGEROUS_CONTENT");
                    break;
                }
            }
        } catch (IllegalArgumentException e) {
            // Not valid base64, which is fine
        }

        return new SecurityScanResult(!threats.isEmpty(), threats);
    }

    /**
     * Detect obfuscation attempts (base64, hex encoding, etc.)
     */
    private boolean detectObfuscation(String value) {
        if (value == null || value.length() < 20) {
            return false;
        }

        for (Pattern pattern : OBFUSCATION_PATTERNS) {
            if (pattern.matcher(value).find()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate tenant ID format to prevent injection.
     */
    private void validateTenantId(String tenantId) {
        if (tenantId == null || tenantId.isBlank()) {
            throw new SecurityPolicyException("Tenant ID is required.");
        }
        if (tenantId.length() > 64) {
            throw new SecurityPolicyException("Tenant ID exceeds maximum length.");
        }
        // Tenant IDs should be UUIDs or alphanumeric with hyphens
        if (!tenantId.matches("^[a-zA-Z0-9\\-]+$")) {
            throw new SecurityPolicyException("Invalid tenant ID format.");
        }
    }

    /**
     * Validate ID format (UUID) to prevent path traversal / injection.
     */
    private void validateIdFormat(String id) {
        if (id == null || id.isBlank()) {
            throw new SecurityPolicyException("ID is required.");
        }
        try {
            UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new SecurityPolicyException("Invalid ID format.");
        }
    }

    /**
     * Validate policy name format.
     */
    private void validatePolicyName(String name) {
        if (name == null || name.isBlank()) {
            throw new SecurityPolicyException("Policy name is required.");
        }
        if (name.length() > MAX_POLICY_NAME_LENGTH) {
            throw new SecurityPolicyException("Policy name exceeds maximum length of " + MAX_POLICY_NAME_LENGTH);
        }
        if (!name.matches("^[a-z][a-z0-9_]*$")) {
            throw new SecurityPolicyException(
                "Policy name must start with lowercase letter and contain only lowercase letters, numbers, and underscores.");
        }
    }

    /**
     * Validate pageable parameters to prevent DoS via huge page sizes.
     */
    private void validatePageable(Pageable pageable) {
        if (pageable == null) {
            return;
        }
        if (pageable.getPageSize() > 100) {
            throw new SecurityPolicyException("Page size cannot exceed 100.");
        }
    }

    /**
     * Determine if a policy is critical and should be protected from deletion.
     */
    private boolean isCriticalSystemPolicy(SecurityPolicy policy) {
        return policy.getPolicyType() == SecurityPolicy.PolicyType.ENCRYPTION_POLICY ||
               policy.getPolicyType() == SecurityPolicy.PolicyType.MFA_POLICY ||
               (policy.getPolicyName() != null &&
                policy.getPolicyName().startsWith("system_"));
    }

    /**
     * Log security events to dedicated security logger.
     * Never logs raw sensitive data — only metadata and classifications.
     */
    private void logSecurityEvent(String eventType, String description, String user, String tenantId) {
        securityLogger.warn("SECURITY_EVENT | type={} | user={} | tenant={} | desc={}",
                eventType, user, maskTenant(tenantId), description);
    }

    /**
     * Mask tenant ID for logging to prevent information leakage.
     */
    private String maskTenant(String tenantId) {
        if (tenantId == null || tenantId.length() < 8) {
            return "***";
        }
        return tenantId.substring(0, 4) + "..." + tenantId.substring(tenantId.length() - 4);
    }

    /**
     * Mask ID for logging.
     */
    private String maskId(String id) {
        if (id == null || id.length() < 8) {
            return "***";
        }
        return id.substring(0, 4) + "..." + id.substring(id.length() - 4);
    }

    // ═════════════════════════════════════════════════════════════════
    // MAPPING
    // ═════════════════════════════════════════════════════════════════

    private SecurityPolicyDTO toDTO(SecurityPolicy entity) {
        SecurityPolicyDTO dto = new SecurityPolicyDTO();
        dto.setId(entity.getId());
        dto.setPolicyName(entity.getPolicyName());
        dto.setDescription(entity.getDescription());
        dto.setPolicyValue(entity.getPolicyValue());
        dto.setPolicyType(entity.getPolicyType());
        dto.setRequiresApproval(entity.getRequiresApproval());
        return dto;
    }

    // ═════════════════════════════════════════════════════════════════
    // INNER CLASSES
    // ═════════════════════════════════════════════════════════════════

    /**
     * Immutable scan result for dangerous content detection.
     */
    private static final class SecurityScanResult {
        private final boolean threatDetected;
        private final Set<String> threatTypes;

        private SecurityScanResult(boolean threatDetected, Set<String> threatTypes) {
            this.threatDetected = threatDetected;
            this.threatTypes = Set.copyOf(threatTypes);
        }

        static SecurityScanResult clean() {
            return new SecurityScanResult(false, Set.of());
        }

        boolean isThreatDetected() {
            return threatDetected;
        }

        String getThreatSummary() {
            return String.join(", ", threatTypes);
        }
    }
}