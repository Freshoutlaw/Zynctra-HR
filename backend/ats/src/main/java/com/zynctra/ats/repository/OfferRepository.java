package com.zynctra.ats.repository;

import com.zynctra.ats.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfferRepository extends JpaRepository<Offer, UUID> {

    Page<Offer> findByTenantIdAndDeletedAtIsNull(UUID tenantId, Pageable pageable);

    Page<Offer> findByTenantIdAndStatusAndDeletedAtIsNull(
        UUID tenantId, Offer.OfferStatus status, Pageable pageable);

    Optional<Offer> findByIdAndTenantIdAndDeletedAtIsNull(UUID id, UUID tenantId);

    Optional<Offer> findByTenantIdAndApplicationIdAndDeletedAtIsNull(
        UUID tenantId, UUID applicationId);

    @Query("""
        SELECT o FROM Offer o
        WHERE o.tenantId = :tenantId
        AND o.deletedAt IS NULL
        AND o.status IN ('SENT', 'NEGOTIATING')
        AND o.expiryDate < CURRENT_DATE
        """)
    List<Offer> findExpiredOffers(UUID tenantId);

    long countByTenantIdAndStatusAndDeletedAtIsNull(UUID tenantId, Offer.OfferStatus status);

    @Query("""
        SELECT o.status, COUNT(o) FROM Offer o
        WHERE o.tenantId = :tenantId AND o.deletedAt IS NULL
        GROUP BY o.status
        """)
    List<Object[]> countByStatusGrouped(UUID tenantId);

    @Query("""
        SELECT AVG(o.salary) FROM Offer o
        WHERE o.tenantId = :tenantId
        AND o.deletedAt IS NULL
        AND o.status = 'ACCEPTED'
        """)
    java.math.BigDecimal averageAcceptedSalary(UUID tenantId);
}