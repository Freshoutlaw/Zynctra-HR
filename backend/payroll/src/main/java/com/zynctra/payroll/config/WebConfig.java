package com.zynctra.payroll.config;

import com.zynctra.payroll.security.SecurePageableResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final SecurePageableResolver securePageableResolver;

    public WebConfig(SecurePageableResolver securePageableResolver) {
        this.securePageableResolver = securePageableResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(0, securePageableResolver);
    }
}
