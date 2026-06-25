package com.zynctra.learning.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.zynctra.learning.entity.AiTutoringSession;

@Repository
public interface AiTutoringSessionRepository extends JpaRepository<AiTutoringSession, String> {

    List<AiTutoringSession> findByTenantId(String tenantId);

    @Query("SELECT s FROM AiTutoringSession s WHERE s.tenantId = :tenantId")
    Page<AiTutoringSession> findByTenantId(String tenantId, Pageable pageable);

    Optional<AiTutoringSession> findByIdAndTenantId(String id, String tenantId);

    Optional<AiTutoringSession> findByIdAndTenant(String id, String tenantId);

    List<AiTutoringSession> findByTenantIdAndUserId(String tenantId, String userId);

    @Query("SELECT s FROM AiTutoringSession s WHERE s.tenantId = :tenantId AND s.userId = :userId")
    Page<AiTutoringSession> findByTenantIdAndUserId(String tenantId, String userId, Pageable pageable);
}
