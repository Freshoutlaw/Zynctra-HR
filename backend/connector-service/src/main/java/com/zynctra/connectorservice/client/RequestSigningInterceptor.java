package com.zynctra.connector.client;

import java.io.IOException;
import java.net.http.HttpRequest;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

public class RequestSigningInterceptor implements ClientHttpRequestInterceptor {
    
    private final String connectorType;
    
    public RequestSigningInterceptor(String connectorType) {
        this.connectorType = connectorType;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, 
                                         ClientHttpRequestExecution execution) throws IOException {
        
        String timestamp = String.valueOf(Instant.now().getEpochSecond());
        String nonce = UUID.randomUUID().toString();
        String bodyHash = hashBody(body);
        
        // Add Zynctra-specific security headers
        request.getHeaders().set("X-Zynctra-Timestamp", timestamp);
        request.getHeaders().set("X-Zynctra-Nonce", nonce);
        request.getHeaders().set("X-Zynctra-Connector", connectorType);
        request.getHeaders().set("X-Zynctra-Body-Hash", bodyHash);
        
        // Sign the request
        String signature = signRequest(request, body, timestamp, nonce);
        request.getHeaders().set("X-Zynctra-Signature", signature);
        
        return execution.execute(request, body);
    }
    
    private String hashBody(byte[] body) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(body);
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to hash body", e);
        }
    }
    
    private String signRequest(HttpRequest request, byte[] body, String timestamp, String nonce) {
        try {
            String secret = System.getenv("CONNECTOR_SIGNING_SECRET_" + connectorType.toUpperCase());
            if (secret == null) {
                throw new IllegalStateException("No signing secret configured for: " + connectorType);
            }
            
            StringBuilder payload = new StringBuilder();
            payload.append(request.getMethod()).append("|");
            payload.append(request.getURI()).append("|");
            payload.append(timestamp).append("|");
            payload.append(nonce).append("|");
            payload.append(Base64.getEncoder().encodeToString(body));
            
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(key);
            byte[] signature = mac.doFinal(payload.toString().getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(signature);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to sign request", e);
        }
    }
}