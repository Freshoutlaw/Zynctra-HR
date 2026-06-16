package com.zynctra.authservice.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpVerificationRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "OTP is required")
    private String otp;

    public OtpVerificationRequest() {}

    public OtpVerificationRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public static OtpVerificationRequestBuilder builder() {
        return new OtpVerificationRequestBuilder();
    }

    public static class OtpVerificationRequestBuilder {
        private String email;
        private String otp;

        public OtpVerificationRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public OtpVerificationRequestBuilder otp(String otp) {
            this.otp = otp;
            return this;
        }

        public OtpVerificationRequest build() {
            return new OtpVerificationRequest(email, otp);
        }
    }
}
