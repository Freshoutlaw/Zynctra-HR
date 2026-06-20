package com.zynctra.ats.service;

import com.zynctra.ats.dto.CandidateRequest;
import com.zynctra.ats.entity.Candidate;
import com.zynctra.ats.repository.CandidateRepository;
import com.zynctra.ats.security.TenantAuthenticationToken;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class CandidateService {

    private static final Logger log = LoggerFactory.getLogger(CandidateService.class);
    private final CandidateRepository candidateRepository;

    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Candidate createCandidate(CandidateRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();

        candidateRepository.findByTenantIdAndEmailAndDeletedAtIsNull(tenantId, request.getEmail())
            .ifPresent(existing -> {
                throw new IllegalStateException("Candidate with email already exists: " + request.getEmail());
            });

        Candidate candidate = Candidate.builder()
            .organizationId(tenantId)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .linkedinUrl(request.getLinkedinUrl())
            .portfolioUrl(request.getPortfolioUrl())
            .source(request.getSource())
            .status(Candidate.CandidateStatus.NEW)
            .currentCompany(request.getCurrentCompany())
            .currentTitle(request.getCurrentTitle())
            .yearsOfExperience(request.getYearsOfExperience())
            .salaryExpectation(request.getSalaryExpectation())
            .salaryCurrency(request.getSalaryCurrency())
            .noticePeriodDays(request.getNoticePeriodDays())
            .availabilityDate(request.getAvailabilityDate())
            .referredBy(request.getReferredBy())
            .customFields(request.getCustomFields() != null ? new java.util.HashMap<>(request.getCustomFields()) : null)
            .gdprConsent(request.getGdprConsent() != null ? request.getGdprConsent() : false)
            .gdprConsentDate(request.getGdprConsent() != null && request.getGdprConsent() ? Instant.now() : null)
            .isAnonymized(false)
            .build();
        candidate.setTenantId(tenantId);

        Candidate saved = candidateRepository.save(candidate);
        log.info("Created candidate: {} for tenant: {}", saved.getId(), tenantId);
        return saved;
    }

    @Transactional(readOnly = true)
    public Candidate getCandidate(UUID candidateId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return candidateRepository.findByIdAndTenantIdAndDeletedAtIsNull(candidateId, auth.getTenantId())
            .orElseThrow(() -> new EntityNotFoundException("Candidate not found: " + candidateId));
    }

    @Transactional(readOnly = true)
    public Page<Candidate> listCandidates(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return candidateRepository.findByTenantIdAndDeletedAtIsNull(auth.getTenantId(), pageable);
    }

    @Transactional(readOnly = true)
    public Page<Candidate> listCandidatesByStatus(Candidate.CandidateStatus status, Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return candidateRepository.findByTenantIdAndStatusAndDeletedAtIsNull(auth.getTenantId(), status, pageable);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Candidate updateCandidate(UUID candidateId, CandidateRequest request) {
        Candidate candidate = getCandidate(candidateId);

        candidate.setFirstName(request.getFirstName());
        candidate.setLastName(request.getLastName());
        candidate.setPhone(request.getPhone());
        candidate.setLinkedinUrl(request.getLinkedinUrl());
        candidate.setPortfolioUrl(request.getPortfolioUrl());
        candidate.setCurrentCompany(request.getCurrentCompany());
        candidate.setCurrentTitle(request.getCurrentTitle());
        candidate.setYearsOfExperience(request.getYearsOfExperience());
        candidate.setSalaryExpectation(request.getSalaryExpectation());
        candidate.setSalaryCurrency(request.getSalaryCurrency());
        candidate.setNoticePeriodDays(request.getNoticePeriodDays());
        candidate.setAvailabilityDate(request.getAvailabilityDate());
        candidate.setCustomFields(request.getCustomFields() != null ? new java.util.HashMap<>(request.getCustomFields()) : null);

        return candidateRepository.save(candidate);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Candidate updateCandidateStatus(UUID candidateId, Candidate.CandidateStatus status) {
        Candidate candidate = getCandidate(candidateId);
        candidate.setStatus(status);
        return candidateRepository.save(candidate);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public void deleteCandidate(UUID candidateId) {
        Candidate candidate = getCandidate(candidateId);
        candidate.setDeletedAt(Instant.now());
        candidateRepository.save(candidate);
        log.info("Deleted candidate: {}", candidateId);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public void anonymizeCandidate(UUID candidateId) {
        Candidate candidate = getCandidate(candidateId);
        candidate.setFirstName("ANONYMIZED");
        candidate.setLastName("ANONYMIZED");
        candidate.setEmail("anonymized@deleted.com");
        candidate.setPhone(null);
        candidate.setLinkedinUrl(null);
        candidate.setPortfolioUrl(null);
        candidate.setCurrentCompany(null);
        candidate.setCurrentTitle(null);
        candidate.setResumeStorageKey(null);
        candidate.setCustomFields(null);
        candidate.setIsAnonymized(true);
        candidate.setAnonymizedAt(Instant.now());
        candidateRepository.save(candidate);
        log.info("Anonymized candidate: {}", candidateId);
    }

    @Transactional(readOnly = true)
    public List<Candidate> searchCandidates(String query, Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return candidateRepository.searchCandidates(auth.getTenantId(), query, pageable);
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}
