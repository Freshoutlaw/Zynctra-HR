package com.zynctra.payroll.security;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * AES-256-GCM + HMAC-SHA256 for financial data.
 * 
 * SECURITY INVARIANTS:
 * - Separate master key from core-hr PII (compartmentalization)
 * - HMAC for additional integrity on top of GCM
 * - Key rotation support via key version prefix
 */
@Service
public class PayrollEncryptionService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;
    private static final int KEY_LENGTH = 32;

    private final SecureRandom secureRandom = new SecureRandom();

    public String encrypt(String plaintext, String tenantId) {
        if (plaintext == null) return null;
        try {
            byte[] key = deriveKey(tenantId);
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"), 
                new GCMParameterSpec(TAG_LENGTH, iv));

            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            // HMAC for additional integrity
            byte[] hmac = computeHmac(iv, ciphertext, key);

            ByteBuffer buffer = ByteBuffer.allocate(1 + iv.length + hmac.length + ciphertext.length);
            buffer.put((byte) 1); // Key version
            buffer.put(iv);
            buffer.put(hmac);
            buffer.put(ciphertext);

            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: payroll_encryption_failure tenant={}", tenantId);
            throw new SecurityException("Encryption failed", e);
        }
    }

    public String decrypt(String ciphertext) {
        if (ciphertext == null) return null;
        String tenantId = com.zynctra.common.tenant.TenantContext.getCurrentTenant();
        return decrypt(ciphertext, tenantId);
    }

    public String decrypt(String ciphertext, String tenantId) {
        if (ciphertext == null) return null;
        try {
            byte[] decoded = Base64.getDecoder().decode(ciphertext);
            ByteBuffer buffer = ByteBuffer.wrap(decoded);

            byte keyVersion = buffer.get();
            byte[] iv = new byte[IV_LENGTH];
            buffer.get(iv);
            byte[] hmac = new byte[32]; // SHA-256
            buffer.get(hmac);
            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);

            byte[] key = deriveKey(tenantId);

            // Verify HMAC before decryption
            byte[] expectedHmac = computeHmac(iv, encrypted, key);
            if (!MessageDigest.isEqual(hmac, expectedHmac)) {
                SEC_LOG.error("SECURITY_EVENT: payroll_hmac_mismatch tenant={}", tenantId);
                throw new SecurityException("Data integrity check failed");
            }

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"),
                new GCMParameterSpec(TAG_LENGTH, iv));

            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: payroll_decryption_failure tenant={}", tenantId);
            throw new SecurityException("Decryption failed", e);
        }
    }

    public String hashForLookup(String plaintext, String tenantId) {
        if (plaintext == null) return null;
        try {
            byte[] key = deriveKey(tenantId);
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return Base64.getEncoder().encodeToString(
                mac.doFinal(plaintext.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new SecurityException("Hash failed", e);
        }
    }

    private byte[] computeHmac(byte[] iv, byte[] ciphertext, byte[] key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            mac.update(iv);
            return mac.doFinal(ciphertext);
        } catch (Exception e) {
            throw new SecurityException("HMAC computation failed", e);
        }
    }

    private byte[] deriveKey(String tenantId) {
        String masterSecret = System.getenv("PAYROLL_MASTER_SECRET");
        if (masterSecret == null || masterSecret.length() < 32) {
            throw new IllegalStateException("PAYROLL_MASTER_SECRET must be >= 32 chars");
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(masterSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] derived = mac.doFinal(("PAYROLL" + tenantId).getBytes(StandardCharsets.UTF_8));
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            return sha256.digest(derived);
        } catch (Exception e) {
            throw new SecurityException("Key derivation failed", e);
        }
    }
}
