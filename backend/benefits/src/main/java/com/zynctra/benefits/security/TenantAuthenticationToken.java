package com.zynctra.benefits.security;

import java.util.Collection;
import java.util.UUID;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class TenantAuthenticationToken extends AbstractAuthenticationToken {

    private final Object principal;
    private final Object credentials;
    private final UUID tenantId;
    private final String email;

    public TenantAuthenticationToken(Object principal, Object credentials,
                                      Collection<? extends GrantedAuthority> authorities,
                                      UUID tenantId, String email) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        this.tenantId = tenantId;
        this.email = email;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return credentials;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getEmail() {
        return email;
    }
}