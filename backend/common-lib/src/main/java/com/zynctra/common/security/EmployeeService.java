package com.zynctra.hr.service;

import com.zynctra.hr.entity.Employee;
import com.zynctra.hr.repository.EmployeeRepository;
import com.zynctra.common.security.TenantContext;
import com.zynctra.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll(); // Filter is applied automatically by TenantAspect
    }

    public Employee getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Transactional
    public Employee createEmployee(Employee employee) {
        employee.setTenantId(TenantContext.getCurrentTenant());
        // Salary encryption logic would go here before saving
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(UUID id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);
        
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setJobTitle(employeeDetails.getJobTitle());
        employee.setStatus(employeeDetails.getStatus());
        
        if (employeeDetails.getSalaryEncrypted() != null) {
            employee.setSalaryEncrypted(employeeDetails.getSalaryEncrypted());
        }

        return employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(UUID id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }
    
    public List<Employee> getOrganizationChart() {
        // Logic to build hierarchical structure
        // This still respects the tenant filter via the repository call
        return employeeRepository.findAll();
    }
}