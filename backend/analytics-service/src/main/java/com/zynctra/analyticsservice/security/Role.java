package com.zynctra.analytics.security;

/**
 * Role Enumeration
 * 
 * Ordered by privilege level for comparison operations.
 * Lower ordinal = lower privilege.
 */
public enum Role {
    READONLY,
    EMPLOYEE,
    MANAGER,
    HR_MANAGER,
    ACCOUNTANT,
    TENANT_ADMIN,
    SUPER_ADMIN
}