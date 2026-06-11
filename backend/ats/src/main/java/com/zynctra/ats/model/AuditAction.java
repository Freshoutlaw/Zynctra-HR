package com.zynctra.ats.model;

/**
 * Enumerates every auditable action in the ATS module.
 *
 * <p>Used to ensure consistent action naming in security audit logs
 * and to enable policy-based audit retention.</p>
 */
public enum AuditAction {

    // Candidate lifecycle
    CANDIDATE_CREATED, 
    CANDIDATE_VIEWED,
    CANDIDATE_UPDATED,
    CANDIDATE_STATUS_CHANGED,
    CANDIDATE_DELETED,
    CANDIDATE_ANONYMIZED,
    CANDIDATE_SEARCHED,

    // Job requisition lifecycle
    JOB_CREATED,
    JOB_VIEWED,
    JOB_UPDATED,
    JOB_PUBLISHED,
    JOB_CLOSED,
    JOB_DELETED,
    JOB_SEARCHED,

    // Application lifecycle
    APPLICATION_SUBMITTED,
    APPLICATION_VIEWED,
    APPLICATION_STAGE_MOVED,
    APPLICATION_WITHDRAWN,
    APPLICATION_DELETED,

    // Interview lifecycle
    INTERVIEW_SCHEDULED,
    INTERVIEW_VIEWED,
    INTERVIEW_FEEDBACK_SUBMITTED,
    INTERVIEW_CANCELLED,
    INTERVIEW_MARKED_NO_SHOW,
    INTERVIEW_DELETED,

    // Offer lifecycle
    OFFER_CREATED,
    OFFER_VIEWED,
    OFFER_APPROVED,
    OFFER_SENT,
    OFFER_ACCEPTED,
    OFFER_DECLINED,
    OFFER_NEGOTIATED,
    OFFER_DELETED,

    // Security events
    AUTHENTICATION_SUCCESS,
    AUTHENTICATION_FAILURE,
    AUTHORIZATION_DENIED,
    RATE_LIMIT_EXCEEDED,
    SUSPICIOUS_INPUT_DETECTED,
    SESSION_INVALIDATED,
    TENANT_ISOLATION_VIOLATION
}
