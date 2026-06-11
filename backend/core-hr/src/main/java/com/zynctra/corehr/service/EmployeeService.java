package com.zynctra.corehr.service;

import com.zynctra.corehr.dto.EmployeeDto;
import com.zynctra.corehr.entity.Employee;
import com.zynctra.corehr.repository.EmployeeRepository;
import com.zynctra.common.dto.PageResponse;
import com.zynctra.common.exception.ResourceNotFoundException;
import com.zynctra.common.security.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public PageResponse<EmployeeDto> listEmployees(String status, Pageable pageable) {
        String tenantId = TenantContext.getCurrentTenant();
        Page<Employee> page;

        if (status != null && !status.isEmpty()) {
            page = employeeRepository.findByTenantIdAndStatusAndDeletedAtIsNull(tenantId, status, pageable);
        } else {
            page = employeeRepository.findByTenantIdAndDeletedAtIsNull(tenantId, pageable);
        }

        return PageResponse.of(page.map(this::convertToDto));
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployee(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        Employee employee = employeeRepository.findByIdAndTenantId(employeeId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", employeeId));
        return convertToDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        String tenantId = TenantContext.getCurrentTenant();
        String userId = TenantContext.getCurrentUserId();

        Employee employee = Employee.builder()
                .id(UUID.randomUUID().toString())
                .tenantId(tenantId)
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phoneNumber(dto.getPhoneNumber())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .departmentId(dto.getDepartmentId())
                .jobTitle(dto.getJobTitle())
                .managerId(dto.getManagerId())
                .hireDate(dto.getHireDate())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .employmentType(dto.getEmploymentType())
                .salary(dto.getSalary())
                .currency(dto.getCurrency())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .emergencyContactName(dto.getEmergencyContactName())
                .emergencyContactPhone(dto.getEmergencyContactPhone())
                .createdBy(userId)
                .build();

        employee = employeeRepository.save(employee);
        log.info("Employee created: {} {}", employee.getFirstName(), employee.getLastName());
        return convertToDto(employee);
    }

    @Transactional
    public EmployeeDto updateEmployee(String employeeId, EmployeeDto dto) {
        String tenantId = TenantContext.getCurrentTenant();
        String userId = TenantContext.getCurrentUserId();

        Employee employee = employeeRepository.findByIdAndTenantId(employeeId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", employeeId));

        if (dto.getFirstName() != null) employee.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) employee.setLastName(dto.getLastName());
        if (dto.getPhoneNumber() != null) employee.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getJobTitle() != null) employee.setJobTitle(dto.getJobTitle());
        if (dto.getStatus() != null) employee.setStatus(dto.getStatus());
        if (dto.getSalary() != null) employee.setSalary(dto.getSalary());
        if (dto.getDepartmentId() != null) employee.setDepartmentId(dto.getDepartmentId());
        if (dto.getManagerId() != null) employee.setManagerId(dto.getManagerId());

        employee.setUpdatedBy(userId);
        employee = employeeRepository.save(employee);
        log.info("Employee updated: {}", employeeId);
        return convertToDto(employee);
    }

    @Transactional
    public void deleteEmployee(String employeeId) {
        String tenantId = TenantContext.getCurrentTenant();
        String userId = TenantContext.getCurrentUserId();

        Employee employee = employeeRepository.findByIdAndTenantId(employeeId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", employeeId));

        employee.softDelete(userId);
        employeeRepository.save(employee);
        log.info("Employee deleted: {}", employeeId);
    }

    private EmployeeDto convertToDto(Employee employee) {
        return EmployeeDto.builder()
                .id(employee.getId())
                .email(employee.getEmail())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .phoneNumber(employee.getPhoneNumber())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .departmentId(employee.getDepartmentId())
                .jobTitle(employee.getJobTitle())
                .managerId(employee.getManagerId())
                .hireDate(employee.getHireDate())
                .status(employee.getStatus())
                .employmentType(employee.getEmploymentType())
                .salary(employee.getSalary())
                .currency(employee.getCurrency())
                .address(employee.getAddress())
                .city(employee.getCity())
                .state(employee.getState())
                .postalCode(employee.getPostalCode())
                .country(employee.getCountry())
                .emergencyContactName(employee.getEmergencyContactName())
                .emergencyContactPhone(employee.getEmergencyContactPhone())
                .build();
    }
}
