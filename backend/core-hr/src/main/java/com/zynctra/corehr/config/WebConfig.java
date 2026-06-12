package com.zynctra.corehr.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.zynctra.corehr.security.SecurePageableResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final SecurePageableResolver securePageableResolver;

    public WebConfig(SecurePageableResolver securePageableResolver) {
        this.securePageableResolver = securePageableResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        // Replace default resolver with secure version
        resolvers.add(0, securePageableResolver);
    }
}