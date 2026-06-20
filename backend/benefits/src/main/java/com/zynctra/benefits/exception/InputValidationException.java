package com.zynctra.benefits.exception;

public class InputValidationException extends IllegalArgumentException {

    private final String fieldName;
    private final String tenantId;
    private final String userId;
    private final String message;

    public InputValidationException(String fieldName, String message, String tenantId, String userId) {
        super(message);
        this.fieldName = fieldName;
        this.message = message;
        this.tenantId = tenantId;
        this.userId = userId;
    }

    public static InputValidationException forField(String fieldName, String message, String tenantId, String userId) {
        return new InputValidationException(fieldName, message, tenantId, userId);
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getTenantId() {
        return tenantId;
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public String getMessage() {
        return message;
    }
}