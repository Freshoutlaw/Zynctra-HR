package com.zynctra.learning.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;

@Component
public class CertificationIntegrityService {

    private final KeyPair keyPair;
    private final String issuer;

    public CertificationIntegrityService() {
        this.issuer = System.getenv().getOrDefault("CERT_ISSUER", "Zynctra Learning");
        this.keyPair = loadOrGenerateKeyPair();
    }

    public SignedCertificate signCertification(String userId, String courseId, 
                                                String courseName, String userName,
                                                Instant completionDate, double score) {
        try {
            String payload = userId + "|" + courseId + "|" + courseName + "|" 
                + userName + "|" + completionDate.toEpochMilli() + "|" + score;
            
            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initSign(keyPair.getPrivate());
            signature.update(payload.getBytes(StandardCharsets.UTF_8));
            byte[] sigBytes = signature.sign();

            String certId = "ZYN-" + System.currentTimeMillis() + "-" + userId.substring(0, 8);
            
            return new SignedCertificate(
                certId,
                userId,
                courseId,
                courseName,
                userName,
                completionDate,
                score,
                issuer,
                Base64.getEncoder().encodeToString(sigBytes),
                computeChainHash(payload)
            );
        } catch (Exception e) {
            throw new SecurityException("Certificate signing failed", e);
        }
    }

    public boolean verifyCertificate(SignedCertificate cert) {
        try {
            String payload = cert.userId() + "|" + cert.courseId() + "|" + cert.courseName() + "|"
                + cert.userName() + "|" + cert.completionDate().toEpochMilli() + "|" + cert.score();
            
            Signature signature = Signature.getInstance("SHA256withRSA");
            signature.initVerify(keyPair.getPublic());
            signature.update(payload.getBytes(StandardCharsets.UTF_8));
            return signature.verify(Base64.getDecoder().decode(cert.signature()));
        } catch (Exception e) {
            return false;
        }
    }

    private String computeChainHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getEncoder().encodeToString(
                digest.digest(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }

    private KeyPair loadOrGenerateKeyPair() {
        String privateKeyEnv = System.getenv("CERT_PRIVATE_KEY");
        String publicKeyEnv = System.getenv("CERT_PUBLIC_KEY");
        
        if (privateKeyEnv != null && publicKeyEnv != null) {
            try {
                byte[] privateBytes = Base64.getDecoder().decode(privateKeyEnv);
                byte[] publicBytes = Base64.getDecoder().decode(publicKeyEnv);
                
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");
                PrivateKey privateKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privateBytes));
                PublicKey publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(publicBytes));
                return new KeyPair(publicKey, privateKey);
            } catch (Exception e) {
                throw new SecurityException("Failed to load certificate keys", e);
            }
        }
        
        // Generate new pair (store securely in production)
        try {
            KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(4096);
            return gen.generateKeyPair();
        } catch (Exception e) {
            throw new SecurityException("Failed to generate certificate keys", e);
        }
    }

    public record SignedCertificate(
        String certId,
        String userId,
        String courseId,
        String courseName,
        String userName,
        Instant completionDate,
        double score,
        String issuer,
        String signature,
        String chainHash
    ) {}
}