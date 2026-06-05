/**
 * /frontend/src/services/security/inputValidator.ts
 *
 * Input validation utilities (pure service).
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class InputValidator {
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      if (password.length < 12) errors.push('At least 12 characters');
      if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
      if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
      if (!/[0-9]/.test(password)) errors.push('At least one number');
      if (!/[!@#$%^&*]/.test(password)) errors.push('At least one special character');
    }
    return { isValid: errors.length === 0, errors };
  }

  validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    if (!phone) {
      errors.push('Phone number is required');
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(phone)) {
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
    if (!username) {
      errors.push('Username is required');
    } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      errors.push(
        'Username must be 3–20 characters and contain only letters, numbers, underscores, or hyphens'
      );
    }
    return { isValid: errors.length === 0, errors };
  }

  validateInteger(value: unknown): ValidationResult {
    const errors: string[] = [];
    if (!Number.isInteger(value)) errors.push('Value must be an integer');
    return { isValid: errors.length === 0, errors };
  }

  validateRange(value: number, min: number, max: number): ValidationResult {
    const errors: string[] = [];
    if (value < min || value > max)
      errors.push(`Value must be between ${min} and ${max}`);
    return { isValid: errors.length === 0, errors };
  }
}

export default new InputValidator();