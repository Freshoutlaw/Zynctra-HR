package com.zynctra.hr.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Data
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
}