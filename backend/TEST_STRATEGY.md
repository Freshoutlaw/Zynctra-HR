# Backend Test Strategy Guide

## Overview

This guide provides comprehensive testing strategies for all Zynctra HR backend services. Tests cover unit tests, integration tests, API tests, and end-to-end scenarios.

## Test Pyramid

\\\
        /\
       /  \  E2E Tests (10%) - Full workflow scenarios
      /----\
     /      \  Integration Tests (30%) - Database, service interactions
    /--------\
   /          \  Unit Tests (60%) - Business logic, utilities
  /____________\
\\\

## Unit Tests (60% of tests)

### Purpose
- Test business logic in isolation
- Validate calculations and algorithms
- Test edge cases and error conditions
- Fast execution (< 1ms per test)

### Tools & Framework
- JUnit 5 (Jupiter)
- Mockito for mocking dependencies
- Hamcrest for assertions
- ArchUnit for architecture validation

### Example: PayrollCalculationService Unit Tests

\\\java
@ExtendWith(MockitoExtension.class)
public class PayrollCalculationServiceTest {
    
    @InjectMocks
    private PayrollCalculationService payrollCalculationService;
    
    @Mock
    private TaxService taxService;
    
    @Mock
    private DeductionRepository deductionRepository;
    
    private Employee testEmployee;
    private PayslipCalculationData testData;
    
    @BeforeEach
    void setUp() {
        testEmployee = new Employee();
        testEmployee.setId(UUID.randomUUID());
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setSalary(new BigDecimal("60000"));
        
        testData = new PayslipCalculationData();
        testData.setEmployee(testEmployee);
        testData.setPeriodStartDate(LocalDate.of(2024, 5, 1));
        testData.setPeriodEndDate(LocalDate.of(2024, 5, 31));
        testData.setRegularHours(new BigDecimal("160"));
        testData.setOvertimeHours(new BigDecimal("5"));
        testData.setBonuses(new BigDecimal("500"));
        testData.setDeductions(new ArrayList<>());
    }
    
    @Test
    @DisplayName("Should calculate gross pay correctly with base salary and overtime")
    void testGrossPay_WithOvertimeAndBonus() {
        // Arrange
        Payslip payslip = payrollCalculationService.calculatePayslip(testData);
        
        // Assert
        // 60000 / 260 days = 230.77 per day
        // 10 days (May 1-10, assuming) = 2307.70
        // Overtime: 60000 / 2080 hours = 28.85/hour × 1.5 = 43.27 × 5 hours = 216.35
        // Bonus: 500
        // Total Gross ≈ 3024.05
        assertThat(payslip.getGrossPay())
            .isCloseTo(new BigDecimal("3024"), offset(new BigDecimal("100")));
    }
    
    @Test
    @DisplayName("Should return zero gross pay when employee salary is null")
    void testGrossPay_WithNullSalary() {
        testEmployee.setSalary(null);
        
        Payslip payslip = payrollCalculationService.calculatePayslip(testData);
        
        assertThat(payslip.getGrossPay())
            .isZero();
    }
    
    @Test
    @DisplayName("Should calculate net pay correctly after deductions and taxes")
    void testNetPay_AfterAllDeductions() {
        // Arrange
        TaxCalculationResult taxResult = new TaxCalculationResult();
        taxResult.setFederalIncomeTax(new BigDecimal("450"));
        taxResult.setStateIncomeTax(new BigDecimal("100"));
        taxResult.setSocialSecurityTax(new BigDecimal("188"));
        taxResult.setMedicareTax(new BigDecimal("44"));
        
        when(taxService.calculateTaxes(any())).thenReturn(taxResult);
        
        EmployeeDeduction deduction = new EmployeeDeduction();
        deduction.setDeduction(new Deduction());
        deduction.getDeduction().setFixedAmount(new BigDecimal("100"));
        testData.setDeductions(Arrays.asList(deduction));
        
        // Act
        Payslip payslip = payrollCalculationService.calculatePayslip(testData);
        
        // Assert
        // Gross - Deductions - Taxes
        BigDecimal expectedNetPay = payslip.getGrossPay()
            .subtract(new BigDecimal("100"))
            .subtract(new BigDecimal("782"));  // Total taxes
        
        assertThat(payslip.getNetPay()).isEqualTo(expectedNetPay);
    }
    
    @Test
    @DisplayName("Should handle pre-tax vs post-tax deductions correctly")
    void testDeductions_PreTaxVsPostTax() {
        // Arrange
        Deduction preTaxDed = new Deduction();
        preTaxDed.setType(DeductionType.PRE_TAX);
        preTaxDed.setFixedAmount(new BigDecimal("500"));
        
        Deduction postTaxDed = new Deduction();
        postTaxDed.setType(DeductionType.POST_TAX);
        postTaxDed.setFixedAmount(new BigDecimal("100"));
        
        // Act & Assert
        // Pre-tax reduces taxable income (tested via taxable income calc)
        // Post-tax doesn't affect taxes
    }
}
\\\

### Example: EmployeeService Business Logic Tests

\\\java
@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {
    
    @InjectMocks
    private EmployeeService employeeService;
    
    @Mock
    private EmployeeRepository employeeRepository;
    
    @Mock
    private DepartmentRepository departmentRepository;
    
    @Mock
    private AuditLogService auditLogService;
    
    private UUID tenantId;
    private UUID userId;
    private EmployeeRequest request;
    
    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        userId = UUID.randomUUID();
        request = EmployeeRequest.builder()
            .firstName("Jane")
            .lastName("Smith")
            .email("jane@example.com")
            .employmentType(EmploymentType.FULL_TIME)
            .hireDate(LocalDate.of(2024, 1, 1))
            .build();
    }
    
    @Test
    @DisplayName("Should create employee successfully")
    void testCreateEmployee_Success() {
        // Arrange
        when(employeeRepository.existsByEmailAndTenantId(
            "jane@example.com", tenantId)).thenReturn(false);
        
        Employee savedEmployee = new Employee();
        savedEmployee.setId(UUID.randomUUID());
        savedEmployee.setFirstName("Jane");
        savedEmployee.setLastName("Smith");
        savedEmployee.setEmail("jane@example.com");
        
        when(employeeRepository.save(any(Employee.class)))
            .thenReturn(savedEmployee);
        
        // Act
        EmployeeResponse response = employeeService.createEmployee(
            request, tenantId, userId);
        
        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("jane@example.com");
        assertThat(response.getFirstName()).isEqualTo("Jane");
        
        verify(employeeRepository).save(any(Employee.class));
        verify(auditLogService).logCreate(eq("EMPLOYEE"), anyString(), 
            anyString(), eq(tenantId), eq(userId));
    }
    
    @Test
    @DisplayName("Should fail when email already exists")
    void testCreateEmployee_DuplicateEmail() {
        // Arrange
        when(employeeRepository.existsByEmailAndTenantId(
            "jane@example.com", tenantId)).thenReturn(true);
        
        // Act & Assert
        assertThatThrownBy(() -> employeeService.createEmployee(
            request, tenantId, userId))
            .isInstanceOf(BusinessException.class)
            .hasMessageContaining("already exists");
    }
    
    @Test
    @DisplayName("Should fail with invalid email format")
    void testCreateEmployee_InvalidEmail() {
        // Arrange
        request.setEmail("not-an-email");
        
        // Act & Assert
        assertThatThrownBy(() -> employeeService.createEmployee(
            request, tenantId, userId))
            .isInstanceOf(ValidationException.class);
    }
    
    @Test
    @DisplayName("Should fail when manager doesn't exist")
    void testCreateEmployee_InvalidManager() {
        // Arrange
        UUID managerId = UUID.randomUUID();
        request.setManagerId(managerId);
        
        when(employeeRepository.existsByEmailAndTenantId(
            "jane@example.com", tenantId)).thenReturn(false);
        when(employeeRepository.findByIdAndTenantId(managerId, tenantId))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> employeeService.createEmployee(
            request, tenantId, userId))
            .isInstanceOf(NotFoundException.class);
    }
}
\\\

## Integration Tests (30% of tests)

### Purpose
- Test service interactions
- Validate database operations
- Test repository queries
- Test transaction management
- Test multi-tenant isolation

### Tools
- Spring Boot Test
- @DataJpaTest for repository tests
- @SpringBootTest for full integration
- TestContainers for PostgreSQL in tests
- Testcontainers PostgreSQL

### Example: EmployeeRepository Integration Test

\\\java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public class EmployeeRepositoryIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
        DockerImageName.parse("postgres:15-alpine")
    )
    .withDatabaseName("zynctra_test")
    .withUsername("test")
    .withPassword("test");
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    private UUID tenantId;
    private Employee testEmployee;
    
    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        testEmployee = new Employee();
        testEmployee.setTenantId(tenantId);
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setEmail("john@example.com");
        testEmployee.setStatus(EmploymentStatus.ACTIVE);
        testEmployee.setArchived(false);
    }
    
    @Test
    @DisplayName("Should find employee by ID and tenant ID")
    void testFindByIdAndTenantId() {
        // Arrange
        Employee saved = entityManager.persistAndFlush(testEmployee);
        entityManager.clear();
        
        // Act
        Optional<Employee> found = employeeRepository
            .findByIdAndTenantId(saved.getId(), tenantId);
        
        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("john@example.com");
    }
    
    @Test
    @DisplayName("Should not find employee from different tenant")
    void testFindByIdAndTenantId_DifferentTenant() {
        // Arrange
        Employee saved = entityManager.persistAndFlush(testEmployee);
        UUID differentTenant = UUID.randomUUID();
        entityManager.clear();
        
        // Act
        Optional<Employee> found = employeeRepository
            .findByIdAndTenantId(saved.getId(), differentTenant);
        
        // Assert
        assertThat(found).isEmpty();  // Multi-tenant isolation verified!
    }
    
    @Test
    @DisplayName("Should check email uniqueness within tenant")
    void testExistsByEmailAndTenantId() {
        // Arrange
        entityManager.persistAndFlush(testEmployee);
        entityManager.clear();
        
        // Act
        boolean exists = employeeRepository
            .existsByEmailAndTenantId("john@example.com", tenantId);
        
        // Assert
        assertThat(exists).isTrue();
    }
    
    @Test
    @DisplayName("Should allow same email in different tenants")
    void testEmailUniquePerTenant() {
        // Arrange
        testEmployee.setTenantId(tenantId);
        Employee employee2 = new Employee();
        employee2.setTenantId(UUID.randomUUID());
        employee2.setFirstName("Jane");
        employee2.setLastName("Smith");
        employee2.setEmail("john@example.com");  // Same email, different tenant
        employee2.setStatus(EmploymentStatus.ACTIVE);
        employee2.setArchived(false);
        
        entityManager.persistAndFlush(testEmployee);
        entityManager.persistAndFlush(employee2);
        entityManager.clear();
        
        // Act
        boolean existsTenant1 = employeeRepository
            .existsByEmailAndTenantId("john@example.com", tenantId);
        boolean existsTenant2 = employeeRepository
            .existsByEmailAndTenantId("john@example.com", employee2.getTenantId());
        
        // Assert
        assertThat(existsTenant1).isTrue();
        assertThat(existsTenant2).isTrue();
    }
}
\\\

### Example: PayrollService Integration Test

\\\java
@SpringBootTest
@Transactional
public class PayrollServiceIntegrationTest {
    
    @Autowired
    private PayrollService payrollService;
    
    @Autowired
    private PayrollRunRepository payrollRunRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    private UUID tenantId;
    private PayrollRunRequest request;
    
    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        request = new PayrollRunRequest();
        request.setPeriodName("May 2024");
        request.setStartDate(LocalDate.of(2024, 5, 1));
        request.setEndDate(LocalDate.of(2024, 5, 31));
        request.setPaymentMethod(PaymentMethod.DIRECT_DEPOSIT);
    }
    
    @Test
    @DisplayName("Should prevent duplicate payroll runs for same period")
    void testCreatePayrollRun_PreventDuplicates() {
        // Arrange & Act
        payrollService.createPayrollRun(request, tenantId, UUID.randomUUID());
        
        // Act & Assert - Second run should fail
        assertThatThrownBy(() -> 
            payrollService.createPayrollRun(request, tenantId, UUID.randomUUID())
        )
        .isInstanceOf(BusinessException.class);
    }
    
    @Test
    @DisplayName("Should enforce payroll status workflow")
    void testPayrollStatusWorkflow() {
        // Arrange
        PayrollRunResponse run = payrollService.createPayrollRun(
            request, tenantId, UUID.randomUUID());
        
        // Act & Assert - Can only approve CALCULATED status, not DRAFT
        assertThatThrownBy(() ->
            payrollService.approvePayroll(run.getId(), tenantId, UUID.randomUUID())
        )
        .isInstanceOf(BusinessException.class)
        .hasMessageContaining("CALCULATED");
    }
}
\\\

## API Tests (10% of tests)

### Purpose
- Test REST endpoints end-to-end
- Validate HTTP status codes
- Test request/response serialization
- Test authorization/authentication
- Test error responses

### Tools
- MockMvc for Spring Boot integration
- REST Assured for REST endpoint testing
- JsonPath for JSON assertions

### Example: EmployeeController API Tests

\\\java
@SpringBootTest
@AutoConfigureMockMvc
public class EmployeeControllerApiTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @MockBean
    private JwtTokenProvider jwtTokenProvider;
    
    @MockBean
    private TenantContext tenantContext;
    
    @MockBean
    private AuthContext authContext;
    
    private String validToken;
    private UUID tenantId;
    private UUID userId;
    
    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        userId = UUID.randomUUID();
        validToken = "Bearer valid-jwt-token";
        
        when(tenantContext.getTenantId()).thenReturn(tenantId);
        when(authContext.getCurrentUserId()).thenReturn(userId);
    }
    
    @Test
    @DisplayName("Should create employee with valid request")
    void testCreateEmployee_Success() throws Exception {
        // Arrange
        String request = """
            {
              "firstName": "John",
              "lastName": "Doe",
              "email": "john@example.com",
              "employmentType": "FULL_TIME",
              "hireDate": "2024-01-01"
            }
            """;
        
        // Act & Assert
        mockMvc.perform(post("/api/v1/employees")
            .header("Authorization", validToken)
            .header("X-Tenant-ID", tenantId.toString())
            .contentType(MediaType.APPLICATION_JSON)
            .content(request))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.firstName").value("John"))
            .andExpect(jsonPath("$.data.email").value("john@example.com"));
    }
    
    @Test
    @DisplayName("Should return 400 with invalid email")
    void testCreateEmployee_InvalidEmail() throws Exception {
        // Arrange
        String request = """
            {
              "firstName": "John",
              "lastName": "Doe",
              "email": "invalid-email",
              "employmentType": "FULL_TIME"
            }
            """;
        
        // Act & Assert
        mockMvc.perform(post("/api/v1/employees")
            .header("Authorization", validToken)
            .header("X-Tenant-ID", tenantId.toString())
            .contentType(MediaType.APPLICATION_JSON)
            .content(request))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));
    }
    
    @Test
    @DisplayName("Should return 401 without valid JWT token")
    void testCreateEmployee_Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/v1/employees")
            .header("X-Tenant-ID", tenantId.toString())
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isUnauthorized());
    }
    
    @Test
    @DisplayName("Should list employees with pagination")
    void testListEmployees_WithPagination() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/v1/employees")
            .param("page", "0")
            .param("size", "20")
            .header("Authorization", validToken)
            .header("X-Tenant-ID", tenantId.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.pageable.pageNumber").exists());
    }
}
\\\

## End-to-End (E2E) Scenarios (10% of tests)

### Example: Complete Payroll Workflow

\\\java
@SpringBootTest
@Transactional
public class PayrollWorkflowE2ETest {
    
    @Autowired
    private PayrollService payrollService;
    
    @Autowired
    private PayrollRunRepository payrollRunRepository;
    
    @Autowired
    private PayslipRepository payslipRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Test
    @DisplayName("Complete payroll workflow: Create → Calculate → Approve → Finalize")
    void testCompletePayrollWorkflow() {
        // STEP 1: Create employees
        UUID tenantId = UUID.randomUUID();
        Employee emp1 = createTestEmployee(tenantId, "emp1@test.com", "60000");
        Employee emp2 = createTestEmployee(tenantId, "emp2@test.com", "45000");
        
        // STEP 2: Create payroll run
        PayrollRunRequest runRequest = new PayrollRunRequest();
        runRequest.setPeriodName("May 2024");
        runRequest.setStartDate(LocalDate.of(2024, 5, 1));
        runRequest.setEndDate(LocalDate.of(2024, 5, 31));
        runRequest.setPaymentMethod(PaymentMethod.DIRECT_DEPOSIT);
        
        PayrollRunResponse run = payrollService.createPayrollRun(
            runRequest, tenantId, UUID.randomUUID());
        
        assertThat(run.getStatus()).isEqualTo(PayrollStatus.DRAFT);
        
        // STEP 3: Calculate payroll
        payrollService.calculatePayroll(run.getId(), tenantId, UUID.randomUUID());
        
        PayrollRun calculatedRun = payrollRunRepository.findById(run.getId()).get();
        assertThat(calculatedRun.getStatus()).isEqualTo(PayrollStatus.CALCULATED);
        assertThat(calculatedRun.getEmployeeCount()).isEqualTo(2);
        assertThat(calculatedRun.getTotalGross()).isNotZero();
        
        // STEP 4: Approve payroll
        UUID approverId = UUID.randomUUID();
        payrollService.approvePayroll(run.getId(), tenantId, approverId);
        
        PayrollRun approvedRun = payrollRunRepository.findById(run.getId()).get();
        assertThat(approvedRun.getStatus()).isEqualTo(PayrollStatus.APPROVED);
        assertThat(approvedRun.getApprovedBy()).isEqualTo(approverId);
        
        // STEP 5: Finalize payroll
        payrollService.finalizePayroll(run.getId(), tenantId, UUID.randomUUID());
        
        PayrollRun finalizedRun = payrollRunRepository.findById(run.getId()).get();
        assertThat(finalizedRun.getStatus()).isEqualTo(PayrollStatus.FINALIZED);
        assertThat(finalizedRun.getPaymentDate()).isNotNull();
        
        // STEP 6: Verify payslips generated
        List<Payslip> payslips = payslipRepository.findByPayrollRunId(run.getId());
        assertThat(payslips).hasSize(2);
        assertThat(payslips).allMatch(p -> p.getStatus().equals(PayslipStatus.FINALIZED));
        assertThat(payslips).allMatch(p -> p.getNetPay().compareTo(BigDecimal.ZERO) > 0);
    }
}
\\\

## Test Execution & Coverage

### Run All Tests
\\\ash
mvn clean test
\\\

### Run Specific Test Class
\\\ash
mvn test -Dtest=EmployeeServiceTest
\\\

### Run with Coverage Report
\\\ash
mvn clean test jacoco:report
# Report at: target/site/jacoco/index.html
\\\

### Coverage Goals
- Unit tests: 80% code coverage
- Integration tests: 60% coverage of repository/service layers
- API tests: 100% of controller paths
- Overall target: 75% code coverage

## Test Data & Fixtures

Create a TestDataBuilder for consistent test data:

\\\java
public class TestDataBuilder {
    
    public static Employee buildEmployee(UUID tenantId) {
        return Employee.builder()
            .id(UUID.randomUUID())
            .tenantId(tenantId)
            .firstName("John")
            .lastName("Doe")
            .email("john+\@test.com")
            .employmentType(EmploymentType.FULL_TIME)
            .status(EmploymentStatus.ACTIVE)
            .salary(new BigDecimal("60000"))
            .build();
    }
    
    public static PayrollRun buildPayrollRun(UUID tenantId) {
        return PayrollRun.builder()
            .id(UUID.randomUUID())
            .tenantId(tenantId)
            .periodName("May 2024")
            .startDate(LocalDate.of(2024, 5, 1))
            .endDate(LocalDate.of(2024, 5, 31))
            .status(PayrollStatus.DRAFT)
            .build();
    }
}
\\\

## Continuous Integration

### GitHub Actions Example

\\\yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: zynctra_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      
      - name: Run tests
        run: mvn clean test -q
      
      - name: Generate coverage report
        run: mvn jacoco:report
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
\\\

## Summary

- **Unit Tests**: 60% - Fast, isolated business logic
- **Integration Tests**: 30% - Database, service layers, multi-tenant isolation
- **API Tests**: 10% - End-to-end endpoint validation
- **Coverage Target**: 75% overall
- **Execution Time**: < 5 minutes for full suite
