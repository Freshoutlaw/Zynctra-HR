package com.zynctra.analytics.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

/**
 * Tenant Authentication Token
 * 
 * Extended authentication token that carries tenant context
 * for multi-tenant authorization decisions.
 */
public class TenantAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private final UUID tenantId;
    private final String email;

    public TenantAuthenticationToken(Object principal,
                                      Object credentials,
                                      Collection<? extends GrantedAuthority> authorities,
                                      UUID tenantId,
                                      String email) {
        super(principal, credentials, authorities);
        this.tenantId = tenantId;
        this.email = email;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getEmail() {
        return email;
    }
}