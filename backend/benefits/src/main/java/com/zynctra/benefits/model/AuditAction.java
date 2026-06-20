package com.zynctra.benefits.model;

/**
 * Enumeration of auditable actions within the benefits domain.
 */
public enum AuditAction {
    BENEFIT_PLAN_CREATED,
    BENEFIT_PLAN_VIEWED,
    BENEFIT_PLAN_UPDATED,
    BENEFIT_PLAN_DELETED,
    ENROLLMENT_CREATED,
    ENROLLMENT_CANCELLED,
    CLAIM_SUBMITTED,
    CLAIM_APPROVED,
    CLAIM_DENIED,
    SECURITY_INCIDENT
}