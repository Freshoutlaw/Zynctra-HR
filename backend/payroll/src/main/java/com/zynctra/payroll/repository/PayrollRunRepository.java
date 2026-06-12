package com.zynctra.payroll.repository;

import com.zynctra.payroll.entity.PayrollRun;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRunRepository extends JpaRepository<<PayrollRun, String> {

    @Query("SELECT p FROM PayrollRun p WHERE p.id = :id AND p.tenantId = :tenantId AND p.deleted = false")
    Optional<<PayrollRun> findByIdAndTenant(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM PayrollRun p WHERE p.payrollRunNumber = :num AND p.tenantId = :tenantId AND p.deleted = false")
    Optional<<PayrollRun> findByNumberAndTenant(@Param("num") String num, @Param("tenantId") String tenantId);

    @Query("SELECT p FROM PayrollRun p WHERE p.tenantId = :tenantId AND p.deleted = false ORDER BY p.payPeriodStart DESC")
    Page<<PayrollRun> findByTenant(@Param("tenantId") String tenantId, Pageable pageable);

    @Query("SELECT p FROM PayrollRun p WHERE p.tenantId = :tenantId AND p.status = :status AND p.deleted = false")
    List<<PayrollRun> findByTenantAndStatus(@Param("tenantId") String tenantId, @Param("status") PayrollRun.PayrollStatus status);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PayrollRun p " +
           "WHERE p.idempotencyKey = :key AND p.tenantId = :tenantId")
    boolean existsByIdempotencyKey(@Param("key") String key, @Param("tenantId") String tenantId);

    @Modifying
    @Query("UPDATE PayrollRun p SET p.status = 'CANCELLED', p.updatedBy = :actor " +
           "WHERE p.id = :id AND p.tenantId = :tenantId AND p.status IN ('DRAFT', 'REVIEW')")
    int cancelPayroll(@Param("id") String id, @Param("tenantId") String tenantId, @Param("actor") String actor);

    // NO delete, NO native queries
}