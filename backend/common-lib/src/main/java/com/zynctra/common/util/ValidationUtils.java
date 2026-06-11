package com.zynctra.common.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ValidationUtils {

    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    public static boolean isValidPhoneNumber(String phone) {
        return phone != null && phone.matches("^\\+?[0-9]{10,}$");
    }

    public static boolean isStrongPassword(String password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
        return password != null && password.length() >= 8 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*[0-9].*") &&
                password.matches(".*[!@#$%^&*].*");
    }

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
