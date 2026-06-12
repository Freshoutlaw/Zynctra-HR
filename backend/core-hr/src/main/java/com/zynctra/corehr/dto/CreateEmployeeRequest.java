package com.zynctra.corehr.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class CreateEmployeeRequest {

    @NotBlank
    @Size(min = 3, max = 32)
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "Employee number: uppercase alphanumeric and hyphens only")
    private String employeeNumber;

    @NotBlank
    @Size(max = 64)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "First name: letters, spaces, hyphens, apostrophes only")
    private String firstName;

    @NotBlank
    @Size(max = 64)
    @Pattern(regexp = "^[a-zA-Z\\s'-]+$", message = "Last name: letters, spaces, hyphens, apostrophes only")
    private String lastName;

    @NotBlank
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    @Size(max = 128)
    private String email;

    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{10,20}$", message = "Phone: 10-20 digits, optional + prefix")
    @Size(max = 32)
    private String phone;

    @NotNull
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank
    @Size(max = 64)
    @Pattern(regexp = "^[a-zA-Z0-9-]+$")
    private String departmentId;

    @NotBlank
    @Size(max = 128)
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-/&]+$", message = "Job title: alphanumeric and basic punctuation only")
    private String jobTitle;

    @NotNull
    @PastOrPresent
    private LocalDate hireDate;

    // NO salary field — set via separate secure endpoint with approval
    // NO accessLevel field — defaults to EMPLOYEE
    // NO managerId field — set via separate transfer endpoint

    // Getters and setters
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String v) { this.employeeNumber = v; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String v) { this.firstName = v; }
    public String getLastName() { return lastName; }
    public void setLastName(String v) { this.lastName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v != null ? v.toLowerCase().trim() : null; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate v) { this.dateOfBirth = v; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String v) { this.departmentId = v; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String v) { this.jobTitle = v; }
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate v) { this.hireDate = v; }
}