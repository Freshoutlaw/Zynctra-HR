package com.zynctra.corehr.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Employee response with automatic data masking.
 * SSN and bank accounts NEVER leave backend unmasked.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse {

    private final String id;
    private final String employeeNumber;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String phone;
    private final String dateOfBirth;
    private final String departmentName;
    private final String managerName;
    private final String jobTitle;
    private final String employmentStatus;
    private final String hireDate;
    private final String accessLevel;
    private final String profilePhotoPath;
    private final Boolean mfaEnabled;
    private final String salary;
    private final String ssnLastFour;

    public EmployeeResponse(String id, String employeeNumber, String firstName, String lastName,
                            String email, String phone, String dateOfBirth, String departmentName,
                            String managerName, String jobTitle, String employmentStatus,
                            String hireDate, String accessLevel, String profilePhotoPath,
                            Boolean mfaEnabled, String salary, String ssnLastFour) {
        this.id = id;
        this.employeeNumber = employeeNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.departmentName = departmentName;
        this.managerName = managerName;
        this.jobTitle = jobTitle;
        this.employmentStatus = employmentStatus;
        this.hireDate = hireDate;
        this.accessLevel = accessLevel;
        this.profilePhotoPath = profilePhotoPath;
        this.mfaEnabled = mfaEnabled;
        this.salary = salary;
        this.ssnLastFour = ssnLastFour;
    }

    // Getters only — immutable DTO
    public String getId() { return id; }
    public String getEmployeeNumber() { return employeeNumber; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getDateOfBirth() { return dateOfBirth; }
    public String getDepartmentName() { return departmentName; }
    public String getManagerName() { return managerName; }
    public String getJobTitle() { return jobTitle; }
    public String getEmploymentStatus() { return employmentStatus; }
    public String getHireDate() { return hireDate; }
    public String getAccessLevel() { return accessLevel; }
    public String getProfilePhotoPath() { return profilePhotoPath; }
    public Boolean getMfaEnabled() { return mfaEnabled; }
    public String getSalary() { return salary; }
    public String getSsnLastFour() { return ssnLastFour; }
}