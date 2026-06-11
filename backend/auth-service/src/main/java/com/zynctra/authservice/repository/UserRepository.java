package com.zynctra.authservice.repository;

import com.zynctra.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndTenantIdAndDeletedAtIsNull(String email, String tenantId);
    Optional<User> findByIdAndTenantId(String id, String tenantId);
    boolean existsByEmail(String email);
}
