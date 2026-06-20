package com.zynctra.benefits.exception;

public class TenantIsolationException extends SecurityException {

    private final String resourceType;
    private final String resourceId;
    private final String expectedTenantId;
    private final String actualTenantId;
    private final String userId;

    public TenantIsolationException(String resourceType, String resourceId, String expectedTenantId, String actualTenantId, String userId) {
        super("Tenant isolation violation: expected tenant " + expectedTenantId
                + " but accessed with tenant " + actualTenantId
                + " for resource " + resourceType + " [" + resourceId + "]"
                + " by user " + userId);
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.expectedTenantId = expectedTenantId;
        this.actualTenantId = actualTenantId;
        this.userId = userId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getExpectedTenantId() {
        return expectedTenantId;
    }

    public String getActualTenantId() {
        return actualTenantId;
    }

    public String getUserId() {
        return userId;
    }
}