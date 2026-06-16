package com.zynctra.payroll.security;

import com.zynctra.common.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Argument resolver that adds tenant context validation to Pageable parameters.
 * Ensures that pagination requests are properly scoped to the tenant context.
 */
@Component
@RequiredArgsConstructor
public class SecurePageableResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(Pageable.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter,
                                  ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest,
                                  WebDataBinderFactory binderFactory) throws Exception {
        
        // Validate that tenant context is set
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) {
            throw new RuntimeException("Tenant context not set");
        }
        
        // Get pagination parameters from request
        String pageStr = webRequest.getParameter("page");
        String sizeStr = webRequest.getParameter("size");
        
        int page = pageStr != null ? Integer.parseInt(pageStr) : 0;
        int size = sizeStr != null ? Integer.parseInt(sizeStr) : 20;
        
        // Enforce max page size for security
        if (size > 100) {
            size = 100;
        }
        
        return PageRequest.of(page, size);
    }
}
