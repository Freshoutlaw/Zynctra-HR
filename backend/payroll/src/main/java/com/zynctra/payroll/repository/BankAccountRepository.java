package com.zynctra.payroll.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zynctra.payroll.entity.BankAccount;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, String> {

    @Query("SELECT b FROM BankAccount b WHERE b.id = :id AND b.tenantId = :tenantId AND b.deleted = false")
    Optional<BankAccount> findByIdAndTenant(@Param("id") String id, @Param("tenantId") String tenantId);

    @Query("SELECT b FROM BankAccount b WHERE b.employeeId = :empId AND b.tenantId = :tenantId " +
           "AND b.deleted = false AND b.active = true ORDER BY b.isPrimary DESC")
    List<BankAccount> findActiveByEmployee(@Param("empId") String empId, @Param("tenantId") String tenantId);

    @Query("SELECT b FROM BankAccount b WHERE b.employeeId = :empId AND b.isPrimary = true " +
           "AND b.tenantId = :tenantId AND b.deleted = false AND b.active = true")
    Optional<BankAccount> findPrimaryByEmployee(@Param("empId") String empId, @Param("tenantId") String tenantId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM BankAccount b " +
           "WHERE b.routingNumberHash = :hash AND b.tenantId = :tenantId AND b.deleted = false")
    boolean existsByRoutingHash(@Param("hash") String hash, @Param("tenantId") String tenantId);

    // NO delete
}

