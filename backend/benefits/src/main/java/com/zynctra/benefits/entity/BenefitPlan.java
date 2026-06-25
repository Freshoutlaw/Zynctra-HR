package com.zynctra.benefits.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "benefit_plans")
public class BenefitPlan extends BaseEntity {

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "plan_code", nullable = false, length = 50, unique = true)
    private String planCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PlanType type;

    @Column(length = 5000)
    private String description;

    @Column(name = "coverage_details", length = 10000)
    private String coverageDetails;

    @Column(name = "employer_contribution", precision = 15, scale = 2)
    private BigDecimal employerContribution;

    @Column(name = "employee_contribution", precision = 15, scale = 2)
    private BigDecimal employeeContribution;

    @Column(length = 3)
    private String currency;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PlanStatus status = PlanStatus.DRAFT;


    public enum PlanType {
        MEDICAL, DENTAL, VISION, LIFE, DISABILITY, RETIREMENT, HSA, FSA, WELLNESS, OTHER
    }

    public enum PlanStatus {
        DRAFT, ACTIVE, INACTIVE, ARCHIVED
    }

    public BenefitPlan() {}

    public UUID getOrganizationId() { return organizationId; }
    public void setOrganizationId(UUID organizationId) { this.organizationId = organizationId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }
    public PlanType getType() { return type; }
    public void setType(PlanType type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCoverageDetails() { return coverageDetails; }
    public void setCoverageDetails(String coverageDetails) { this.coverageDetails = coverageDetails; }
    public BigDecimal getEmployerContribution() { return employerContribution; }
    public void setEmployerContribution(BigDecimal employerContribution) { this.employerContribution = employerContribution; }
    public BigDecimal getEmployeeContribution() { return employeeContribution; }
    public void setEmployeeContribution(BigDecimal employeeContribution) { this.employeeContribution = employeeContribution; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public PlanStatus getStatus() { return status; }
    public void setStatus(PlanStatus status) { this.status = status; }


    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final BenefitPlan plan = new BenefitPlan();
        public Builder tenantId(UUID id) { plan.setTenantId(id != null ? id.toString() : null); return this; }
        public Builder organizationId(UUID id) { plan.organizationId = id; return this; }
        public Builder name(String name) { plan.name = name; return this; }
        public Builder planCode(String code) { plan.planCode = code; return this; }
        public Builder type(PlanType type) { plan.type = type; return this; }
        public Builder description(String d) { plan.description = d; return this; }
        public Builder coverageDetails(String d) { plan.coverageDetails = d; return this; }
        public Builder employerContribution(BigDecimal v) { plan.employerContribution = v; return this; }
        public Builder employeeContribution(BigDecimal v) { plan.employeeContribution = v; return this; }
        public Builder currency(String c) { plan.currency = c; return this; }
        public Builder effectiveDate(LocalDate d) { plan.effectiveDate = d; return this; }
        public Builder expirationDate(LocalDate d) { plan.expirationDate = d; return this; }
        public Builder status(PlanStatus s) { plan.status = s; return this; }
        public Builder isActive(Boolean a) { plan.isActive = a; return this; }
        public Builder createdBy(UUID id) { plan.setCreatedBy(id != null ? id.toString() : null); return this; }
        public BenefitPlan build() { return plan; }
    }
}
