package com.zynctra.ats.model;

import java.util.Objects;
import java.util.UUID;

/**
 * Thread-local holder for the current tenant context.
 *
 * <p>Every request thread must have a valid tenant context set before
 * accessing any tenant-scoped data. The context is immutable once set
 * and can only be cleared by the same principal that set it.</p>
 *
 * <p><strong>Security invariant:</strong> Tenant ID must never be null
 * for authenticated requests. Anonymous requests are not supported for
 * tenant-scoped endpoints.</p>
 */
public final class TenantContext {

    private static final ThreadLocal<TenantContext> CURRENT = new ThreadLocal<>();

    private final UUID tenantId;
    private final UUID userId;
    private final String role;
    private final long setAt;
    private final String correlationId;

    private TenantContext(UUID tenantId, UUID userId, String role, String correlationId) {
        this.tenantId = Objects.requireNonNull(tenantId, "tenantId cannot be null");
        this.userId = Objects.requireNonNull(userId, "userId cannot be null");
        this.role = Objects.requireNonNull(role, "role cannot be null");
        this.correlationId = correlationId != null ? correlationId : UUID.randomUUID().toString().substring(0, 8);
        this.setAt = System.currentTimeMillis();
    }

    public static void set(UUID tenantId, UUID userId, String role, String correlationId) {
        if (CURRENT.get() != null) {
            throw new IllegalStateException("TenantContext already set for this thread. Possible context leak.");
        }
        CURRENT.set(new TenantContext(tenantId, userId, role, correlationId));
    }

    public static TenantContext get() {
        TenantContext ctx = CURRENT.get();
        if (ctx == null) {
            throw new IllegalStateException("No tenant context set for this thread. Authentication filter may be missing.");
        }
        return ctx;
    }

    public static UUID requireTenantId() {
        return get().tenantId;
    }

    public static UUID requireUserId() {
        return get().userId;
    }

    public static String requireRole() {
        return get().role;
    }

    public static boolean hasRole(String requiredRole) {
        TenantContext ctx = CURRENT.get();
        return ctx != null && requiredRole.equals(ctx.role);
    }

    public static boolean isPresent() {
        return CURRENT.get() != null;
    }

    public static void clear() {
        CURRENT.remove();
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public long getSetAt() {
        return setAt;
    }

    public void assertTenantMatch(UUID requestedTenantId, String resourceType) {
        if (!this.tenantId.equals(requestedTenantId)) {
            throw new com.zynctra.ats.exception.TenantIsolationException(
                resourceType,
                requestedTenantId != null ? requestedTenantId.toString() : "null",
                this.tenantId.toString(),
                requestedTenantId != null ? requestedTenantId.toString() : "null",
                this.userId.toString()
            );
        }
    }

    @Override
    public String toString() {
        return String.format("TenantContext{tenant=%s, user=%s, role=%s}",
            tenantId, userId, role);
    }
}
