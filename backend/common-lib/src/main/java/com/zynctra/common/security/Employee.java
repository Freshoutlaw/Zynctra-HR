package com.zynctra.hr.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import java.util.UUID;

@Entity
@Table(name = "employees")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = String.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    private String firstName;
    private String lastName;
    
    @Column(unique = true)
    private String email;
    
    private String department;
    private String jobTitle;
    
    // Encrypted field
    private String salaryEncrypted;

    @Enumerated(EnumType.STRING)
    private EmploymentStatus status;

    // Constructors
    public Employee() {
    }

    public Employee(UUID id, String tenantId, String firstName, String lastName, String email,
                   String department, String jobTitle, String salaryEncrypted, EmploymentStatus status) {
        this.id = id;
        this.tenantId = tenantId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.jobTitle = jobTitle;
        this.salaryEncrypted = salaryEncrypted;
        this.status = status;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getTenantId() {
        return tenantId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getDepartment() {
        return department;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getSalaryEncrypted() {
        return salaryEncrypted;
    }

    public EmploymentStatus getStatus() {
        return status;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public void setSalaryEncrypted(String salaryEncrypted) {
        this.salaryEncrypted = salaryEncrypted;
    }

    public void setStatus(EmploymentStatus status) {
        this.status = status;
    }
}
