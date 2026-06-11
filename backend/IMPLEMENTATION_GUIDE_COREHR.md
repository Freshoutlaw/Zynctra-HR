# Core HR Service Implementation Guide

## Overview

The Core HR Service manages the complete employee lifecycle and organizational structure. This guide covers implementing the business logic for all employee-related operations.

## Architecture

```
core-hr/
├── src/main/java/com/zynctra/corehr/
│   ├── controller/
│   │   ├── EmployeeController.java          # REST endpoints
│   │   ├── DepartmentController.java
│   │   ├── TeamController.java
│   │   └── LocationController.java
│   ├── service/
│   │   ├── EmployeeService.java             # Business logic
│   │   ├── DepartmentService.java
│   │   ├── TeamService.java
│   │   ├── LocationService.java
│   │   └── OrgChartService.java
│   ├── repository/
│   │   ├── EmployeeRepository.java          # Database access
│   │   ├── DepartmentRepository.java
│   │   ├── CustomEmployeeRepository.java    # Custom queries
│   │   └── [other repositories]
│   ├── entity/
│   │   ├── Employee.java                    # JPA entities
│   │   ├── Department.java
│   │   ├── Team.java
│   │   └── Location.java
│   ├── dto/
│   │   ├── EmployeeRequest.java             # Input DTOs
│   │   ├── EmployeeResponse.java            # Output DTOs
│   │   └── [other DTOs]
│   └── config/
│       └── CoreHrConfig.java                # Service configuration
```

## Data Model

### Employee Entity

```java
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID tenantId;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column
    private String phone;
    
    @Column
    private String employeeId;  // Company-assigned ID
    
    @Enumerated(EnumType.STRING)
    private EmploymentStatus status;  // ACTIVE, INACTIVE, ON_LEAVE, TERMINATED
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
    
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Employee manager;  // Direct report relationship
    
    @Column
    private String jobTitle;
    
    @Column
    private LocalDate hireDate;
    
    @Column
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;  // FULL_TIME, PART_TIME, CONTRACT
    
    @Column
    private BigDecimal salary;
    
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
    
    @ElementCollection
    @CollectionTable(name = "employee_custom_fields")
    private Map<String, String> customFields;
    
    @OneToMany(mappedBy = "employee")
    private List<EmployeeDocument> documents;
    
    @Column
    private Boolean archived = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @Column
    private UUID createdBy;
    
    @Column
    private UUID updatedBy;
}
```

### Enum Values

```java
public enum EmploymentStatus {
    ACTIVE,           // Currently employed
    INACTIVE,         // Hired but not started
    ON_LEAVE,        // Temporary absence
    ON_PROBATION,    // Probationary period
    TERMINATED,      // Terminated (soft delete)
    SUSPENDED        // Disciplinary suspension
}

public enum EmploymentType {
    FULL_TIME,
    PART_TIME,
    CONTRACT,
    TEMPORARY,
    INTERN
}
```

## Service Implementation

### EmployeeService - Core Business Logic

```java
@Service
@Transactional
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private TenantContext tenantContext;
    
    // 1. Create Employee
    public EmployeeResponse createEmployee(
        EmployeeRequest request,
        UUID tenantId,
        UUID createdBy
    ) {
        // Validation
        validateEmployeeRequest(request);
        
        if (employeeRepository.existsByEmailAndTenantId(
            request.getEmail(), 
            tenantId
        )) {
            throw new BusinessException("Employee with email already exists");
        }
        
        if (request.getManagerId() != null) {
            Employee manager = employeeRepository
                .findByIdAndTenantId(request.getManagerId(), tenantId)
                .orElseThrow(() -> new NotFoundException("Manager not found"));
            
            if (!manager.getStatus().equals(EmploymentStatus.ACTIVE)) {
                throw new BusinessException("Manager must be in ACTIVE status");
            }
        }
        
        // Create entity
        Employee employee = new Employee();
        employee.setTenantId(tenantId);
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setEmployeeId(request.getEmployeeId());
        employee.setStatus(EmploymentStatus.ACTIVE);
        employee.setJobTitle(request.getJobTitle());
        employee.setHireDate(request.getHireDate());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setEmploymentType(request.getEmploymentType());
        employee.setSalary(request.getSalary());
        employee.setCreatedBy(createdBy);
        
        // Department
        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository
                .findByIdAndTenantId(request.getDepartmentId(), tenantId)
                .orElseThrow(() -> new NotFoundException("Department not found"));
            employee.setDepartment(dept);
        }
        
        // Save
        Employee saved = employeeRepository.save(employee);
        
        // Audit
        auditLogService.logCreate("EMPLOYEE", saved.getId().toString(), 
            "Created employee: " + saved.getFirstName() + " " + saved.getLastName(),
            tenantId, createdBy);
        
        return mapToResponse(saved);
    }
    
    // 2. Update Employee
    public EmployeeResponse updateEmployee(
        UUID employeeId,
        EmployeeRequest request,
        UUID tenantId,
        UUID updatedBy
    ) {
        Employee employee = employeeRepository
            .findByIdAndTenantId(employeeId, tenantId)
            .orElseThrow(() -> new NotFoundException("Employee not found"));
        
        // Store original for audit
        String originalData = serializeForAudit(employee);
        
        // Update fields
        if (request.getFirstName() != null) {
            employee.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            employee.setLastName(request.getLastName());
        }
        if (request.getJobTitle() != null) {
            employee.setJobTitle(request.getJobTitle());
        }
        if (request.getSalary() != null) {
            employee.setSalary(request.getSalary());
        }
        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }
        
        // Manager change
        if (request.getManagerId() != null && 
            !request.getManagerId().equals(employee.getManager() != null ? 
                employee.getManager().getId() : null)) {
            
            Employee newManager = employeeRepository
                .findByIdAndTenantId(request.getManagerId(), tenantId)
                .orElseThrow(() -> new NotFoundException("Manager not found"));
            
            employee.setManager(newManager);
        }
        
        // Department change
        if (request.getDepartmentId() != null && 
            !request.getDepartmentId().equals(
                employee.getDepartment() != null ? 
                employee.getDepartment().getId() : null)) {
            
            Department dept = departmentRepository
                .findByIdAndTenantId(request.getDepartmentId(), tenantId)
                .orElseThrow(() -> new NotFoundException("Department not found"));
            
            employee.setDepartment(dept);
        }
        
        employee.setUpdatedBy(updatedBy);
        
        Employee updated = employeeRepository.save(employee);
        
        // Audit
        String updatedData = serializeForAudit(updated);
        auditLogService.logUpdate("EMPLOYEE", updated.getId().toString(),
            originalData, updatedData, tenantId, updatedBy);
        
        return mapToResponse(updated);
    }
    
    // 3. Soft Delete Employee
    public void archiveEmployee(
        UUID employeeId,
        UUID tenantId,
        UUID archivedBy
    ) {
        Employee employee = employeeRepository
            .findByIdAndTenantId(employeeId, tenantId)
            .orElseThrow(() -> new NotFoundException("Employee not found"));
        
        // Check for active dependencies
        if (employeeRepository.existsByManagerIdAndArchivedFalse(employeeId)) {
            throw new BusinessException(
                "Cannot archive employee with active direct reports. " +
                "Reassign managers first."
            );
        }
        
        employee.setArchived(true);
        employee.setStatus(EmploymentStatus.TERMINATED);
        employee.setUpdatedBy(archivedBy);
        
        employeeRepository.save(employee);
        
        auditLogService.logDelete("EMPLOYEE", employeeId.toString(),
            "Archived employee", tenantId, archivedBy);
    }
    
    // 4. Get Employee with Full Profile
    public EmployeeResponse getEmployeeProfile(UUID employeeId, UUID tenantId) {
        Employee employee = employeeRepository
            .findByIdAndTenantId(employeeId, tenantId)
            .orElseThrow(() -> new NotFoundException("Employee not found"));
        
        return mapToDetailedResponse(employee);
    }
    
    // 5. List Employees (with filtering and pagination)
    public Page<EmployeeResponse> listEmployees(
        UUID tenantId,
        String departmentId,
        String status,
        String searchTerm,
        Pageable pageable
    ) {
        Specification<Employee> spec = Specification
            .where((root, query, cb) -> cb.equal(root.get("tenantId"), tenantId))
            .and((root, query, cb) -> cb.equal(root.get("archived"), false));
        
        if (departmentId != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("department").get("id"), UUID.fromString(departmentId))
            );
        }
        
        if (status != null) {
            spec = spec.and((root, query, cb) -> 
                cb.equal(root.get("status"), EmploymentStatus.valueOf(status))
            );
        }
        
        if (searchTerm != null && !searchTerm.isBlank()) {
            String searchPattern = "%" + searchTerm.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("firstName")), searchPattern),
                    cb.like(cb.lower(root.get("lastName")), searchPattern),
                    cb.like(cb.lower(root.get("email")), searchPattern),
                    cb.like(cb.lower(root.get("employeeId")), searchPattern)
                )
            );
        }
        
        Page<Employee> page = employeeRepository.findAll(spec, pageable);
        return page.map(this::mapToResponse);
    }
    
    // 6. Get Organization Chart
    public OrgChartResponse getOrgChart(UUID tenantId) {
        // Find all root managers (employees with no manager)
        List<Employee> rootManagers = employeeRepository
            .findRootManagersByTenantId(tenantId);
        
        OrgChartResponse chart = new OrgChartResponse();
        
        for (Employee root : rootManagers) {
            OrgChartNode node = buildOrgChartNode(root);
            chart.addRoot(node);
        }
        
        return chart;
    }
    
    // 7. Change Employee Department
    public void changeEmployeeDepartment(
        UUID employeeId,
        UUID newDepartmentId,
        UUID tenantId,
        UUID changedBy
    ) {
        Employee employee = employeeRepository
            .findByIdAndTenantId(employeeId, tenantId)
            .orElseThrow(() -> new NotFoundException("Employee not found"));
        
        Department newDept = departmentRepository
            .findByIdAndTenantId(newDepartmentId, tenantId)
            .orElseThrow(() -> new NotFoundException("Department not found"));
        
        Department oldDept = employee.getDepartment();
        
        employee.setDepartment(newDept);
        employee.setUpdatedBy(changedBy);
        
        employeeRepository.save(employee);
        
        auditLogService.logUpdate(
            "EMPLOYEE_DEPARTMENT_CHANGE",
            employeeId.toString(),
            "From: " + (oldDept != null ? oldDept.getName() : "N/A"),
            "To: " + newDept.getName(),
            tenantId,
            changedBy
        );
    }
    
    // Helper Methods
    
    private void validateEmployeeRequest(EmployeeRequest request) {
        if (request.getFirstName() == null || request.getFirstName().isBlank()) {
            throw new ValidationException("First name is required");
        }
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new ValidationException("Last name is required");
        }
        if (request.getEmail() == null || !isValidEmail(request.getEmail())) {
            throw new ValidationException("Valid email is required");
        }
        if (request.getHireDate() != null && 
            request.getHireDate().isAfter(LocalDate.now())) {
            throw new ValidationException("Hire date cannot be in the future");
        }
    }
    
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
    
    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
            .id(employee.getId())
            .firstName(employee.getFirstName())
            .lastName(employee.getLastName())
            .email(employee.getEmail())
            .phone(employee.getPhone())
            .employeeId(employee.getEmployeeId())
            .jobTitle(employee.getJobTitle())
            .status(employee.getStatus())
            .employmentType(employee.getEmploymentType())
            .hireDate(employee.getHireDate())
            .departmentId(employee.getDepartment() != null ? 
                employee.getDepartment().getId() : null)
            .managerId(employee.getManager() != null ? 
                employee.getManager().getId() : null)
            .createdAt(employee.getCreatedAt())
            .updatedAt(employee.getUpdatedAt())
            .build();
    }
    
    private OrgChartNode buildOrgChartNode(Employee employee) {
        OrgChartNode node = new OrgChartNode();
        node.setId(employee.getId());
        node.setName(employee.getFirstName() + " " + employee.getLastName());
        node.setJobTitle(employee.getJobTitle());
        
        // Recursively add direct reports
        List<Employee> directReports = employeeRepository
            .findByManagerIdAndArchivedFalse(employee.getId());
        
        for (Employee report : directReports) {
            node.addChild(buildOrgChartNode(report));
        }
        
        return node;
    }
    
    private String serializeForAudit(Employee employee) {
        // Serialize key fields to JSON for audit trail
        return String.format(
            "{\"firstName\":\"%s\",\"lastName\":\"%s\",\"jobTitle\":\"%s\",\"salary\":%s,\"status\":\"%s\"}",
            employee.getFirstName(),
            employee.getLastName(),
            employee.getJobTitle(),
            employee.getSalary(),
            employee.getStatus()
        );
    }
}
```

## REST Controller

```java
@RestController
@RequestMapping("/api/v1/employees")
@PreAuthorize("hasAnyRole('TENANT_ADMIN', 'HR_MANAGER', 'MANAGER')")
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private TenantContext tenantContext;
    
    @Autowired
    private AuthContext authContext;
    
    // Create Employee
    @PostMapping
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
        @Valid @RequestBody EmployeeRequest request
    ) {
        EmployeeResponse response = employeeService.createEmployee(
            request,
            tenantContext.getTenantId(),
            authContext.getCurrentUserId()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(response, "Employee created successfully"));
    }
    
    // List Employees
    @GetMapping
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> listEmployees(
        @RequestParam(required = false) String departmentId,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        
        Page<EmployeeResponse> employees = employeeService.listEmployees(
            tenantContext.getTenantId(),
            departmentId,
            status,
            search,
            pageable
        );
        
        return ResponseEntity.ok(ApiResponse.success(
            employees, "Employees retrieved successfully"
        ));
    }
    
    // Get Employee
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(
        @PathVariable UUID id
    ) {
        EmployeeResponse employee = employeeService.getEmployeeProfile(
            id,
            tenantContext.getTenantId()
        );
        
        return ResponseEntity.ok(ApiResponse.success(
            employee, "Employee retrieved successfully"
        ));
    }
    
    // Update Employee
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'HR_MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
        @PathVariable UUID id,
        @Valid @RequestBody EmployeeRequest request
    ) {
        EmployeeResponse response = employeeService.updateEmployee(
            id,
            request,
            tenantContext.getTenantId(),
            authContext.getCurrentUserId()
        );
        
        return ResponseEntity.ok(ApiResponse.success(
            response, "Employee updated successfully"
        ));
    }
    
    // Archive Employee (Soft Delete)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TENANT_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> archiveEmployee(
        @PathVariable UUID id
    ) {
        employeeService.archiveEmployee(
            id,
            tenantContext.getTenantId(),
            authContext.getCurrentUserId()
        );
        
        return ResponseEntity.ok(ApiResponse.success(
            null, "Employee archived successfully"
        ));
    }
    
    // Get Organization Chart
    @GetMapping("/org-chart")
    public ResponseEntity<ApiResponse<OrgChartResponse>> getOrgChart() {
        OrgChartResponse chart = employeeService.getOrgChart(
            tenantContext.getTenantId()
        );
        
        return ResponseEntity.ok(ApiResponse.success(
            chart, "Organization chart retrieved successfully"
        ));
    }
}
```

## DTO Definitions

```java
@Data
@Builder
public class EmployeeRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Valid email is required")
    private String email;
    
    private String phone;
    
    private String employeeId;
    
    private String jobTitle;
    
    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;
    
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;
    
    @DecimalMin("0.00")
    private BigDecimal salary;
    
    private UUID departmentId;
    
    private UUID managerId;
    
    private UUID locationId;
    
    private EmploymentStatus status;
    
    private Map<String, String> customFields;
}

@Data
@Builder
public class EmployeeResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String employeeId;
    private String jobTitle;
    private EmploymentStatus status;
    private EmploymentType employmentType;
    private LocalDate hireDate;
    private LocalDate dateOfBirth;
    private BigDecimal salary;
    private UUID departmentId;
    private String departmentName;
    private UUID managerId;
    private String managerName;
    private UUID locationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Map<String, String> customFields;
}
```

## Repository Query Methods

```java
@Repository
public interface EmployeeRepository extends 
    JpaRepository<Employee, UUID>,
    JpaSpecificationExecutor<Employee> {
    
    Optional<Employee> findByIdAndTenantId(UUID id, UUID tenantId);
    
    boolean existsByEmailAndTenantId(String email, UUID tenantId);
    
    boolean existsByManagerIdAndArchivedFalse(UUID managerId);
    
    List<Employee> findByManagerIdAndArchivedFalse(UUID managerId);
    
    List<Employee> findRootManagersByTenantId(UUID tenantId);
    
    Page<Employee> findByTenantIdAndArchivedFalse(UUID tenantId, Pageable pageable);
    
    List<Employee> findByDepartmentIdAndArchivedFalse(UUID departmentId);
    
    List<Employee> findByTenantIdAndStatusAndArchivedFalse(
        UUID tenantId,
        EmploymentStatus status
    );
}
```

## Key Business Rules to Implement

1. **Employee Creation**
   - Email must be unique within tenant
   - Manager must exist and be in ACTIVE status
   - Department must exist
   - Hire date must be in the past or today
   - Custom fields must match tenant's field definitions

2. **Employee Updates**
   - Manager changes must be logged
   - Department changes must be logged
   - Salary changes must be logged and may require approval
   - Status changes trigger relevant workflows

3. **Employee Archiving (Soft Delete)**
   - Cannot archive employee with active direct reports
   - Must reassign subordinates first
   - Status changes to TERMINATED
   - Soft deleted employees excluded from most queries

4. **Organization Chart**
   - Prevent circular reporting relationships
   - Validate manager-subordinate hierarchy
   - Handle depth limitations (e.g., max 20 levels)

5. **Custom Fields**
   - Must validate against tenant's custom field definitions
   - Support text, number, date, dropdown types
   - Enforce required vs optional per tenant config

6. **Search and Filtering**
   - Support full-text search on name, email, employee ID
   - Filter by department, status, hire date range
   - Pagination with configurable page size

## Testing Strategy

### Unit Tests
- Validation logic
- Business rule enforcement
- Data transformation

### Integration Tests
- CRUD operations
- Relationship integrity
- Audit logging
- Pagination and filtering

### API Tests
- Controller endpoints
- Authorization checks
- Error handling
- Response formatting

See `TEST_STRATEGY.md` for detailed testing guide.
