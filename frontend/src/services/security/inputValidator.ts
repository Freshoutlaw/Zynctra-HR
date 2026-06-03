/**
 * /frontend/src/services/security/inputValidator.ts
 * 
 * Input validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class InputValidator {
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    } else if (email.length > 254) {
      errors.push('Email is too long');
    }

    return { isValid: errors.length === 0, errors };
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 12) {
        errors.push('Password must be at least 12 characters');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain uppercase letters');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain lowercase letters');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain numbers');
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain special characters');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    const phoneRegex = /^\+?[\d\s\-()]{10,}$/;

    if (!phone) {
      errors.push('Phone number is required');
    } else if (!phoneRegex.test(phone)) {
      errors.push('Invalid phone number format');
    }

    return { isValid: errors.length === 0, errors };
  }

  validateUrl(url: string): ValidationResult {
    const errors: string[] = [];

    try {
      new URL(url);
    } catch {
      errors.push('Invalid URL format');
    }

    return { isValid: errors.length === 0, errors };
  }

  validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

    if (!username) {
      errors.push('Username is required');
    } else if (!usernameRegex.test(username)) {
      errors.push('Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens');
    }

    return { isValid: errors.length === 0, errors };
  }

  validateInteger(value: any): ValidationResult {
    const errors: string[] = [];

    if (!Number.isInteger(value)) {
      errors.push('Value must be an integer');
    }

    return { isValid: errors.length === 0, errors };
  }

  validateRange(value: number, min: number, max: number): ValidationResult {
    const errors: string[] = [];

    if (value < min || value > max) {
      errors.push(`Value must be between ${min} and ${max}`);
    }

    return { isValid: errors.length === 0, errors };
  }
}

export default new InputValidator();