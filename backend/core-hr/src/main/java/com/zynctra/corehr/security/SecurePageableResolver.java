package com.zynctra.corehr.security;

import org.springframework.core.MethodParameter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Set;

/**
 * Custom Pageable resolver that enforces security limits.
 * 
 * SECURITY INVARIANTS:
 * - Max page size: 100 (prevents bulk exfiltration)
 * - Max page number: 10,000 (prevents deep pagination DoS)
 * - Whitelist sort fields only (prevents sort injection)
 * - Default sort: lastName, firstName (predictable, no injection)
 */
@Component
public class SecurePageableResolver extends PageableHandlerMethodArgumentResolver {

    private static final int MAX_PAGE_SIZE = 100;
    private static final int MAX_PAGE_NUMBER = 10000;
    private static final int DEFAULT_PAGE_SIZE = 20;
    
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "lastName", "firstName", "email", "hireDate", "employeeNumber", "createdAt"
    );

    @Override
    public Pageable resolveArgument(MethodParameter methodParameter,
                                    ModelAndViewContainer mavContainer,
                                    NativeWebRequest webRequest,
                                    WebDataBinderFactory binderFactory) {
        
        Pageable pageable = super.resolveArgument(methodParameter, mavContainer, webRequest, binderFactory);
        
        int pageSize = Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
        int pageNumber = Math.min(pageable.getPageNumber(), MAX_PAGE_NUMBER);
        
        Sort secureSort = validateSort(pageable.getSort());
        
        return PageRequest.of(pageNumber, pageSize, secureSort);
    }

    private Sort validateSort(Sort sort) {
        if (sort == null || sort.isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "lastName", "firstName");
        }
        
        Sort.Order[] orders = sort.stream()
            .filter(order -> ALLOWED_SORT_FIELDS.contains(order.getProperty()))
            .toArray(Sort.Order[]::new);
        
        if (orders.length == 0) {
            return Sort.by(Sort.Direction.ASC, "lastName", "firstName");
        }
        
        return Sort.by(orders);
    }
}