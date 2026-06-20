package com.zynctra.ats.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "offers", schema = "ats", indexes = {
    @Index(name = "idx_offers_tenant", columnList = "tenant_id"),
    @Index(name = "idx_offers_app", columnList = "application_id"),
    @Index(name = "idx_offers_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Offer extends TenantBaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "salary", nullable = false, precision = 15, scale = 2)
    private BigDecimal salary;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "bonus", precision = 15, scale = 2)
    private BigDecimal bonus;

    @Column(name = "equity", precision = 15, scale = 2)
    private BigDecimal equity;

    @Column(name = "equity_type", length = 20)
    private String equityType;

    @Column(name = "benefits_summary", columnDefinition = "TEXT")
    private String benefitsSummary;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OfferStatus status;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "accepted_at")
    private Instant acceptedAt;

    @Column(name = "rejected_at")
    private Instant rejectedAt;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "negotiation_notes", columnDefinition = "TEXT")
    private String negotiationNotes;

    @Column(name = "proposed_by", nullable = false)
    private UUID proposedBy;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "offer_letter_storage_key", length = 500)
    private String offerLetterStorageKey;

    @Column(name = "signed_offer_storage_key", length = 500)
    private String signedOfferStorageKey;

    public enum OfferStatus {
        DRAFT,
        PENDING_APPROVAL,
        APPROVED,
        SENT,
        NEGOTIATING,
        ACCEPTED,
        DECLINED,
        EXPIRED,
        WITHDRAWN
    }
}