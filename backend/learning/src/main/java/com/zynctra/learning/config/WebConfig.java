package com.zynctra.learning.config;

import com.zynctra.learning.security.LearningRateLimiter;
import com.zynctra.learning.security.SecurePageableResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final SecurePageableResolver securePageableResolver;
    private final LearningRateLimiter learningRateLimiter;

    public WebConfig(SecurePageableResolver securePageableResolver,
                     LearningRateLimiter learningRateLimiter) {
        this.securePageableResolver = securePageableResolver;
        this.learningRateLimiter = learningRateLimiter;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(0, securePageableResolver);
    }
}