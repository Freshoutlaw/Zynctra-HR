package com.zynctra.common.constant;

public final class SecurityConstants {
    private SecurityConstants() {}

    public static final String JWT_SECRET_ENV = "JWT_SECRET";
    public static final String JWT_EXPIRATION_ENV = "JWT_EXPIRATION_MS";
    public static final String REFRESH_TOKEN_EXPIRATION_ENV = "REFRESH_TOKEN_EXPIRATION_MS";
    
    public static final long DEFAULT_JWT_EXPIRATION_MS = 3600000; // 1 hour
    public static final long DEFAULT_REFRESH_TOKEN_EXPIRATION_MS = 604800000; // 7 days
    
    public static final String TOKEN_TYPE_ACCESS = "ACCESS";
    public static final String TOKEN_TYPE_REFRESH = "REFRESH";
    
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_HR = "HR";
    public static final String ROLE_EMPLOYEE = "EMPLOYEE";
    public static final String ROLE_MANAGER = "MANAGER";
    public static final String ROLE_RECRUITER = "RECRUITER";

    public static final String AUTHORITY_PREFIX = "ROLE_";
}
