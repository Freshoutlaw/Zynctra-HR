package com.zynctra.common.client;

/**
 * Response object for AI service interactions
 */
public class AiResponse {
    private boolean success;
    private String message;
    private String status;
   
    public AiResponse() {
    }

    public AiResponse(boolean success, String message, String status) {
        this.success = success;
        this.message = message;
        this.status = status;
    }

    // Getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Factory methods
    public static AiResponse success(String message) {
        return new AiResponse(true, message, "success");
    }

    public static AiResponse error(String message) {
        return new AiResponse(false, message, "error");
    }

    public static AiResponse blocked(String message) {
        return new AiResponse(false, message, "blocked");
    }
}
