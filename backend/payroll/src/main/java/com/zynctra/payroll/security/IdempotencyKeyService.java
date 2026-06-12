package com.zynctra.payroll.security;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

/**
 * Cryptographic idempotency keys for payroll runs.
 * Prevents duplicate payment processing.
 */
@Service
public class IdempotencyKeyService {

    private final SecureRandom secureRandom = new SecureRandom();
    private final ConcurrentHashMap<String, Boolean> usedKeys = new ConcurrentHashMap<>(); // In production: Redis

    public String generateKey() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return "payroll_" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public boolean isUsed(String key) {
        return usedKeys.containsKey(key);
    }

    public void markUsed(String key) {
        usedKeys.put(key, true);
    }

    public void validateNew(String key) {
        if (isUsed(key)) {
            throw new SecurityException("Idempotency key already used - possible duplicate request");
        }
    }
}