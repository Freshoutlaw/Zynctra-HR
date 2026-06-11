package com.zynctra.ats.security;

import java.util.Collection;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

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