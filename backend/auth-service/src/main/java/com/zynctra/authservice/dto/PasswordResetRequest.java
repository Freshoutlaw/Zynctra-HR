package com.zynctra.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class PasswordResetRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    public PasswordResetRequest() {}

    public PasswordResetRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static PasswordResetRequestBuilder builder() {
        return new PasswordResetRequestBuilder();
    }

    public static class PasswordResetRequestBuilder {
        private String email;

        public PasswordResetRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public PasswordResetRequest build() {
            return new PasswordResetRequest(email);
        }
    }
}
