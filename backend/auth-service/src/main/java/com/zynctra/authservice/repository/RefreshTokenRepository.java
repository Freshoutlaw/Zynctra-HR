package com.zynctra.authservice.repository;

import com.zynctra.authservice.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserIdAndTokenAndDeletedAtIsNull(String userId, String token);
    void deleteByUserId(String userId);
}
