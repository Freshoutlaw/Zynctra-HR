package com.zynctra.ats.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.zynctra.ats.dto.OfferRequest;
import com.zynctra.ats.entity.Application;
import com.zynctra.ats.entity.Offer;
import com.zynctra.ats.repository.ApplicationRepository;
import com.zynctra.ats.repository.OfferRepository;
import com.zynctra.ats.security.TenantAuthenticationToken;
import com.zynctra.ats.validation.InputSanitizer;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final InputSanitizer sanitizer;

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Offer createOffer(OfferRequest request) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        // Validate application exists and belongs to tenant
        Application application = applicationRepository.findByIdAndTenantIdAndDeletedAtIsNull(
                request.getApplicationId(), tenantId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        if (application.getStatus() != Application.ApplicationStatus.ACTIVE) {
            throw new IllegalStateException("Cannot create offer for inactive application");
        }

        // Validate business rules
        validateOfferRequest(request);

        Offer offer = Offer.builder()
            .tenantId(tenantId)
            .organizationId(tenantId)
            .applicationId(application.getId())
            .salary(request.getSalary())
            .currency(sanitizer.sanitizeCurrency(request.getCurrency()))
            .bonus(request.getBonus())
            .equity(request.getEquity())
            .equityType(sanitizer.sanitizeText(request.getEquityType(), 20))
            .benefitsSummary(sanitizer.sanitizeHtml(request.getBenefitsSummary(), 5000))
            .startDate(request.getStartDate())
            .expiryDate(request.getExpiryDate())
            .status(Offer.OfferStatus.DRAFT)
            .proposedBy(userId)
            .build();

        Offer saved = offerRepository.save(offer);
        log.info("Created offer: {} for application: {} by user: {}", 
            saved.getId(), application.getId(), userId);
        return saved;
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Offer getOffer(UUID offerId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return offerRepository.findByIdAndTenantIdAndDeletedAtIsNull(offerId, auth.getTenantId())
            .orElseThrow(() -> new EntityNotFoundException("Offer not found"));
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Page<Offer> listOffers(Pageable pageable) {
        TenantAuthenticationToken auth = getCurrentAuth();
        return offerRepository.findByTenantIdAndDeletedAtIsNull(auth.getTenantId(), pageable);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public Offer approveOffer(UUID offerId, UUID approverId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        UUID tenantId = auth.getTenantId();

        Offer offer = getOffer(offerId);
        if (offer.getStatus() != Offer.OfferStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Offer not in pending approval status");
        }

        offer.setStatus(Offer.OfferStatus.APPROVED);
        offer.setApprovedBy(approverId);
        offer.setApprovedAt(Instant.now());

        Offer saved = offerRepository.save(offer);
        log.info("Approved offer: {} by approver: {}", offerId, approverId);
        return saved;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('HR_MANAGER', 'TENANT_ADMIN', 'SUPER_ADMIN')")
    public Offer sendOffer(UUID offerId) {
        Offer offer = getOffer(offerId);
        if (offer.getStatus() != Offer.OfferStatus.APPROVED) {
            throw new IllegalStateException("Offer must be approved before sending");
        }
        offer.setStatus(Offer.OfferStatus.SENT);
        offer.setSentAt(Instant.now());
        return offerRepository.save(offer);
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('TENANT_ADMIN', 'SUPER_ADMIN')")
    public void deleteOffer(UUID offerId) {
        TenantAuthenticationToken auth = getCurrentAuth();
        Offer offer = getOffer(offerId);
        offer.setDeletedAt(Instant.now());
        offerRepository.save(offer);
        log.info("Deleted offer: {} by user: {}", offerId, auth.getPrincipal());
    }

    private void validateOfferRequest(OfferRequest request) {
        if (request.getExpiryDate() == null || request.getExpiryDate().isBefore(LocalDate.now().plusDays(1))) {
            throw new ValidationException("Expiry date must be at least 1 day in the future");
        }
        if (request.getStartDate() == null || request.getStartDate().isBefore(LocalDate.now())) {
            throw new ValidationException("Start date must be in the future");
        }
        if (request.getSalary() == null || request.getSalary().doubleValue() <= 0) {
            throw new ValidationException("Salary must be positive");
        }
        if (request.getCurrency() == null || !request.getCurrency().matches("^[A-Z]{3}$")) {
            throw new ValidationException("Currency must be 3-letter ISO code");
        }
    }

    private TenantAuthenticationToken getCurrentAuth() {
        return (TenantAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
    }
}