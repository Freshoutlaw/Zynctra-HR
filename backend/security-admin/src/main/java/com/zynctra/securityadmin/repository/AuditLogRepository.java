package com.zynctra.securityadmin.repository;

import com.zynctra.securityadmin.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId AND a.tenantId = :tenantId AND a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    List<AuditLog> findByUserAndTimeRange(@Param("userId") String userId,
                                           @Param("start") Instant start,
                                           @Param("end") Instant end,
                                           @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AuditLog a WHERE a.actionType = :actionType AND a.tenantId = :tenantId AND a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    List<AuditLog> findByActionAndTimeRange(@Param("actionType") String actionType,
                                             @Param("start") Instant start,
                                             @Param("end") Instant end,
                                             @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId AND a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    Page<AuditLog> findByTimeRange(@Param("start") Instant start,
                                    @Param("end") Instant end,
                                    @Param("tenantId") String tenantId,
                                    Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.success = false AND a.tenantId = :tenantId AND a.timestamp BETWEEN :start AND :end ORDER BY a.timestamp DESC")
    List<AuditLog> findFailures(@Param("start") Instant start,
                                 @Param("end") Instant end,
                                 @Param("tenantId") String tenantId);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.userId = :userId AND a.tenantId = :tenantId AND a.timestamp >= :since")
    long countByUserSince(@Param("userId") String userId,
                          @Param("since") Instant since,
                          @Param("tenantId") String tenantId);

    @Query("SELECT a FROM AuditLog a WHERE a.tenantId = :tenantId ORDER BY a.timestamp DESC")
    Page<AuditLog> findAllByTenant(@Param("tenantId") String tenantId, Pageable pageable);
}