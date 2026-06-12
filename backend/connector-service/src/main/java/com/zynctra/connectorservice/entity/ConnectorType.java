package com.zynctra.connector.entity;

/**
 * Strictly controlled connector types.
 * Prevents arbitrary connector type injection.
 */
public enum ConnectorType {
    SLACK,
    WORKDAY,
    SALESFORCE,
    OKTA,
    QUICKBOOKS,
    CUSTOM_WEBHOOK,
    MICROSOFT_TEAMS,
    GOOGLE_WORKSPACE
}