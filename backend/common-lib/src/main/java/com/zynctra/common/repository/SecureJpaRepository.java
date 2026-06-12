package com.zynctra.common.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface SecureJpaRepository<T, ID> extends JpaRepository<T, ID> {
    
    // NEVER use native queries with string concatenation
    // ALWAYS use @Param with named parameters
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.tenantId = :tenantId AND e.deleted = false")
    List<T> findAllActiveByTenant(@Param("tenantId") String tenantId);
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.id = :id AND e.tenantId = :tenantId AND e.deleted = false")
    Optional<T> findByIdAndTenant(@Param("id") ID id, @Param("tenantId") String tenantId);
    
    @Query("SELECT e FROM #{#entityName} e WHERE e.tenantId = :tenantId AND e.deleted = false")
    Page<T> findAllActiveByTenantPaged(@Param("tenantId") String tenantId, Pageable pageable);
    
    @Query("UPDATE #{#entityName} e SET e.deleted = true, e.updatedBy = :updatedBy WHERE e.id = :id AND e.tenantId = :tenantId")
    int softDeleteById(@Param("id") ID id, @Param("tenantId") String tenantId, @Param("updatedBy") String updatedBy);
    
    // Explicitly FORBID dangerous operations at repository level
    // No deleteAll(), no saveAll() without validation, no native queries
}