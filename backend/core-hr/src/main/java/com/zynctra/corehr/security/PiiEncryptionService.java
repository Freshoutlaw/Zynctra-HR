package com.zynctra.corehr.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256-GCM encryption for all PII fields.
 * 
 * SECURITY INVARIANTS:
 * - Tenant-specific derived keys (HKDF-SHA256)
 * - Random 12-byte IV per encryption
 * - 128-bit GCM authentication tag
 * - Ciphertext format: base64(iv + ciphertext + tag)
 * - Master secret from environment ONLY
 */
@Service
public class PiiEncryptionService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;
    private static final int KEY_LENGTH = 32;

    private final SecureRandom secureRandom = new SecureRandom();

    public String encrypt(String plaintext, String tenantId) {
        if (plaintext == null) return null;
        try {
            byte[] key = deriveKey(tenantId);
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(key, "AES"), spec);

            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            ByteBuffer buffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            buffer.put(iv);
            buffer.put(ciphertext);

            return Base64.getEncoder().encodeToString(buffer.array());
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: encryption_failure tenant={}", tenantId);
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

            byte[] iv = new byte[GCM_IV_LENGTH];
            buffer.get(iv);
            byte[] encrypted = new byte[buffer.remaining()];
            buffer.get(encrypted);

            byte[] key = deriveKey(tenantId);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(key, "AES"), spec);

            return new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8);
        } catch (Exception e) {
            SEC_LOG.error("SECURITY_EVENT: decryption_failure tenant={}", tenantId);
            throw new SecurityException("Decryption failed - possible tampering", e);
        }
    }

    /**
     * One-way hash for search/deduplication (e.g., routing number lookup).
     * Uses HMAC-SHA256 with tenant-specific key.
     */
    public String hashForSearch(String plaintext, String tenantId) {
        if (plaintext == null) return null;
        try {
            byte[] key = deriveKey(tenantId);
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            byte[] hash = mac.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new SecurityException("Hash generation failed", e);
        }
    }

    private byte[] deriveKey(String tenantId) {
        String masterSecret = System.getenv("PII_MASTER_SECRET");
        if (masterSecret == null || masterSecret.length() < 32) {
            throw new IllegalStateException("PII_MASTER_SECRET must be set and >= 32 chars");
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(masterSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] derived = mac.doFinal(tenantId.getBytes(StandardCharsets.UTF_8));
            
            // Stretch to 32 bytes using SHA-256 if needed
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            return sha256.digest(derived);
        } catch (Exception e) {
            throw new SecurityException("Key derivation failed", e);
        }
    }
}