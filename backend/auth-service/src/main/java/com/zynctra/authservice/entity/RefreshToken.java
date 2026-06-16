package com.zynctra.authservice.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens", indexes = {
    @Index(name = "idx_refresh_tokens_user_id", columnList = "user_id"),
    @Index(name = "idx_refresh_tokens_token", columnList = "token"),
    @Index(name = "idx_refresh_tokens_expires_at", columnList = "expires_at")
})
public class RefreshToken extends BaseEntity {
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "revoked")
    private Boolean revoked = false;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    public RefreshToken() {}

    public RefreshToken(String userId, String token, LocalDateTime expiresAt) {
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.revoked = false;
    }

    public String getUserId() { return userId; }
    public String getToken() { return token; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public Boolean getRevoked() { return revoked; }
    public LocalDateTime getRevokedAt() { return revokedAt; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setToken(String token) { this.token = token; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public void setRevoked(Boolean revoked) { this.revoked = revoked; }
    public void setRevokedAt(LocalDateTime revokedAt) { this.revokedAt = revokedAt; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public static RefreshTokenBuilder builder() {
        return new RefreshTokenBuilder();
    }

    public static class RefreshTokenBuilder {
        private String id;
        private String tenantId;
        private String userId;
        private String token;
        private LocalDateTime expiresAt;
        private Boolean revoked = false;
        private LocalDateTime revokedAt;
        private String ipAddress;
        private String userAgent;

        public RefreshTokenBuilder id(String id) { this.id = id; return this; }
        public RefreshTokenBuilder tenantId(String tenantId) { this.tenantId = tenantId; return this; }
        public RefreshTokenBuilder userId(String userId) { this.userId = userId; return this; }
        public RefreshTokenBuilder token(String token) { this.token = token; return this; }
        public RefreshTokenBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public RefreshTokenBuilder revoked(Boolean revoked) { this.revoked = revoked; return this; }
        public RefreshTokenBuilder revokedAt(LocalDateTime revokedAt) { this.revokedAt = revokedAt; return this; }
        public RefreshTokenBuilder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public RefreshTokenBuilder userAgent(String userAgent) { this.userAgent = userAgent; return this; }

        public RefreshToken build() {
            RefreshToken rt = new RefreshToken(userId, token, expiresAt);
            rt.setId(this.id);
            rt.setTenantId(this.tenantId);
            rt.setRevoked(revoked);
            rt.setRevokedAt(revokedAt);
            rt.setIpAddress(ipAddress);
            rt.setUserAgent(userAgent);
            return rt;
        }
    }

    public boolean isValid() {
        return !revoked && expiresAt.isAfter(LocalDateTime.now());
    }
}
