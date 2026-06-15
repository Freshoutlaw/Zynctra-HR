package com.zynctra.common.config;

import com.zynctra.common.security.TenantContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

import static com.zynctra.common.constant.ApiConstants.X_REQUEST_ID;
import static com.zynctra.common.constant.ApiConstants.X_TENANT_ID;
import static com.zynctra.common.constant.ApiConstants.X_USER_ID;

@Component
public class TenantResolverFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(TenantResolverFilter.class);
    private final TenantContext tenantContext;

    public TenantResolverFilter(TenantContext tenantContext) {
        this.tenantContext = tenantContext;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String tenantId = request.getHeader(X_TENANT_ID);
            String userId = request.getHeader(X_USER_ID);
            String requestId = request.getHeader(X_REQUEST_ID);

            if (requestId == null) {
                requestId = UUID.randomUUID().toString();
            }

            tenantContext.setTenant(tenantId);
            tenantContext.setUserId(userId);
            tenantContext.setRequestId(requestId);

            response.addHeader(X_REQUEST_ID, requestId);

            filterChain.doFilter(request, response);
        } finally {
            tenantContext.clear();
        }
    }
}

