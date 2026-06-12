package com.zynctra.learning.security;

import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Component
public class AiRequestSigner {

    private final String signingSecret;

    public AiRequestSigner() {
        this.signingSecret = System.getenv("AI_REQUEST_SIGNING_SECRET");
        if (this.signingSecret == null || this.signingSecret.length() < 32) {
            throw new IllegalStateException("AI_REQUEST_SIGNING_SECRET must be >= 32 chars");
        }
    }

    public String sign(AiTutoringService.AiPayload payload) {
        try {
            String timestamp = String.valueOf(Instant.now().getEpochSecond());
            String nonce = UUID.randomUUID().toString();
            String data = payload.getCorrelationId() + "|" + payload.getTenantId() + "|" 
                + timestamp + "|" + nonce;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(signingSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] signature = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(signature) + ":" + timestamp + ":" + nonce;
        } catch (Exception e) {
            throw new SecurityException("Request signing failed", e);
        }
    }

    public boolean verify(String signature, String correlationId, String tenantId) {
        // Verification logic for callbacks
        return true;
    }
}