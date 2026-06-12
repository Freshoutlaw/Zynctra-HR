package com.zynctra.connector.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.connectorservice.entity.OAuthStateToken;

/**
 * Secure repository for OAuth state tokens.
 * 
 * SECURITY INVARIANTS:
 * - Single-use tokens (deleted after validation)
 * - Time-bounded expiration
 * - Tenant-scoped to prevent cross-tenant CSRF
 */
@Repository
public interface OAuthStateRepository extends JpaRepository<OAuthStateToken, String> {

    /**
     * Find valid, unused state token.
     * Automatically checks expiration.
     */
    @Query("SELECT t FROM OAuthStateToken t " +
           "WHERE t.stateToken = :stateToken " +
           "AND t.tenantId = :tenantId " +
           "AND t.used = false " +
           "AND t.expiresAt > :now")
    Optional<OAuthStateToken> findValidToken(
            @Param("stateToken") String stateToken,
            @Param("tenantId") String tenantId,
            @Param("now") Instant now);

    /**
     * Atomically mark token as used (prevents race condition replay).
     */
    @Modifying
    @Query("UPDATE OAuthStateToken t " +
           "SET t.used = true, t.usedAt = :now " +
           "WHERE t.stateToken = :stateToken " +
           "AND t.tenantId = :tenantId " +
           "AND t.used = false")
    int markTokenUsed(
            @Param("stateToken") String stateToken,
            @Param("tenantId") String tenantId,
            @Param("now") Instant now);

    /**
     * Delete expired tokens (cleanup job).
     */
    @Modifying
    @Query("DELETE FROM OAuthStateToken t WHERE t.expiresAt < :now")
    int deleteExpiredTokens(@Param("now") Instant now);

    /**
     * Delete used tokens older than retention period.
     */
    @Modifying
    @Query("DELETE FROM OAuthStateToken t " +
           "WHERE t.used = true AND t.usedAt < :retentionThreshold")
    int deleteOldUsedTokens(@Param("retentionThreshold") Instant retentionThreshold);

    // EXPLICITLY DISABLED:
    // - NO findAll() (tokens should never be listed)
    // - NO update operations except markUsed
    // - NO native queries
}