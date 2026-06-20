package com.zynctra.benefits.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "enrollments")
public class Enrollment extends BaseEntity {

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "plan_id", nullable = false)
    private UUID planId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnrollmentStatus status = EnrollmentStatus.PENDING;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "coverage_level", length = 50)
    private String coverageLevel;

    @Column(name = "dependent_count")
    private Integer dependentCount;

    @Column(name = "employee_contribution", precision = 15, scale = 2)
    private BigDecimal employeeContribution;

    @Column(name = "employer_contribution", precision = 15, scale = 2)
    private BigDecimal employerContribution;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public enum EnrollmentStatus {
        PENDING, ACTIVE, CANCELLED, EXPIRED
    }

    public Enrollment() {}

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public EnrollmentStatus getStatus() { return status; }
    public void setStatus(EnrollmentStatus status) { this.status = status; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getCoverageLevel() { return coverageLevel; }
    public void setCoverageLevel(String coverageLevel) { this.coverageLevel = coverageLevel; }
    public Integer getDependentCount() { return dependentCount; }
    public void setDependentCount(Integer dependentCount) { this.dependentCount = dependentCount; }
    public BigDecimal getEmployeeContribution() { return employeeContribution; }
    public void setEmployeeContribution(BigDecimal employeeContribution) { this.employeeContribution = employeeContribution; }
    public BigDecimal getEmployerContribution() { return employerContribution; }
    public void setEmployerContribution(BigDecimal employerContribution) { this.employerContribution = employerContribution; }
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Enrollment enrollment = new Enrollment();
        public Builder tenantId(UUID id) { enrollment.setTenantId(id != null ? id.toString() : null); return this; }
        public Builder employeeId(UUID id) { enrollment.employeeId = id; return this; }
        public Builder planId(UUID id) { enrollment.planId = id; return this; }
        public Builder status(EnrollmentStatus s) { enrollment.status = s; return this; }
        public Builder effectiveDate(LocalDate d) { enrollment.effectiveDate = d; return this; }
        public Builder endDate(LocalDate d) { enrollment.endDate = d; return this; }
        public Builder coverageLevel(String l) { enrollment.coverageLevel = l; return this; }
        public Builder dependentCount(Integer c) { enrollment.dependentCount = c; return this; }
        public Builder employeeContribution(BigDecimal v) { enrollment.employeeContribution = v; return this; }
        public Builder employerContribution(BigDecimal v) { enrollment.employerContribution = v; return this; }
        public Builder createdBy(UUID id) { enrollment.createdBy = id; return this; }
        public Builder updatedBy(UUID id) { enrollment.updatedBy = id; return this; }
        public Enrollment build() { return enrollment; }
    }
}