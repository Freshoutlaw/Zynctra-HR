package com.zynctra.common.constant;

public final class ApiConstants {
    private ApiConstants() {}

    public static final String API_PREFIX = "/api/v1";
    public static final String X_TENANT_ID = "X-Tenant-ID";
    public static final String X_REQUEST_ID = "X-Request-ID";
    public static final String X_USER_ID = "X-User-ID";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int DEFAULT_PAGE_NUMBER = 0;

    public static final String ISO_DATE_FORMAT = "yyyy-MM-dd";
    public static final String ISO_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
}
