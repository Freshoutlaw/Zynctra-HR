package com.zynctra.corehr.entity;

import com.zynctra.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_employees_email", columnList = "email"),
    @Index(name = "idx_employees_tenant_id", columnList = "tenant_id"),
    @Index(name = "idx_employees_department_id", columnList = "department_id"),
    @Index(name = "idx_employees_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee extends BaseEntity {
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "department_id")
    private String departmentId;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "manager_id")
    private String managerId;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "status", nullable = false)
    private String status; // ACTIVE, ON_LEAVE, INACTIVE

    @Column(name = "employment_type")
    private String employmentType; // FULL_TIME, PART_TIME, CONTRACT

    @Column(name = "salary", precision = 15, scale = 2)
    private Double salary;

    @Column(name = "currency")
    private String currency;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country")
    private String country;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "user_id")
    private String userId;
}
