# Payroll Service Implementation Guide

## Overview

The Payroll Service manages the complete payroll lifecycle including payroll runs, gross-to-net calculations, deductions, taxes, and payslip generation. This guide covers implementing the business logic for all payroll operations.

## Architecture

\\\
payroll/
├── src/main/java/com/zynctra/payroll/
│   ├── controller/
│   │   ├── PayrollController.java              # REST endpoints
│   │   ├── PayslipController.java
│   │   └── DeductionController.java
│   ├── service/
│   │   ├── PayrollService.java                 # Payroll run management
│   │   ├── PayrollCalculationService.java      # Gross-to-net logic
│   │   ├── PayslipService.java                 # Payslip generation
│   │   ├── DeductionService.java               # Deduction management
│   │   ├── TaxService.java                     # Tax calculations
│   │   └── PayrollApprovalService.java         # Approval workflows
│   ├── repository/
│   │   ├── PayrollRunRepository.java
│   │   ├── PayslipRepository.java
│   │   ├── DeductionRepository.java
│   │   └── PayrollItemRepository.java
│   ├── entity/
│   │   ├── PayrollRun.java
│   │   ├── Payslip.java
│   │   ├── PayrollItem.java
│   │   ├── Deduction.java
│   │   ├── Tax.java
│   │   └── PayrollApproval.java
│   ├── dto/
│   │   ├── PayrollRunRequest.java
│   │   ├── PayrollRunResponse.java
│   │   ├── PayslipResponse.java
│   │   └── [other DTOs]
│   └── config/
│       └── PayrollConfig.java
\\\

## Data Model

### PayrollRun Entity

\\\java
@Entity
@Table(name = "payroll_runs")
public class PayrollRun {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID tenantId;
    
    @Column(nullable = false)
    private String periodName;  // e.g., "May 2024"
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Enumerated(EnumType.STRING)
    private PayrollStatus status;  // DRAFT, CALCULATED, APPROVED, FINALIZED
    
    @Column
    private LocalDate paymentDate;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;  // DIRECT_DEPOSIT, CHECK, OTHER
    
    @OneToMany(mappedBy = "payrollRun", cascade = CascadeType.ALL)
    private List<Payslip> payslips = new ArrayList<>();
    
    @Column
    private BigDecimal totalGross;
    
    @Column
    private BigDecimal totalDeductions;
    
    @Column
    private BigDecimal totalNet;
    
    @Column
    private BigDecimal totalTaxes;
    
    @Column
    private UUID approvedBy;
    
    @Column
    private LocalDateTime approvedAt;
    
    @Column
    private Integer employeeCount;
    
    @Column
    private String notes;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @Column
    private UUID createdBy;
}

public enum PayrollStatus {
    DRAFT,          // Being prepared
    CALCULATED,     // Calculations complete
    APPROVED,       // Approved for payment
    FINALIZED,      // Locked from further changes
    REVERSED        // Payroll reversed/cancelled
}

public enum PaymentMethod {
    DIRECT_DEPOSIT,
    CHECK,
    CASH,
    OTHER
}
\\\

### Payslip Entity

\\\java
@Entity
@Table(name = "payslips")
public class Payslip {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID tenantId;
    
    @ManyToOne
    @JoinColumn(name = "payroll_run_id", nullable = false)
    private PayrollRun payrollRun;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @Column
    private String payslipNumber;
    
    // Gross Earnings
    @Column(nullable = false)
    private BigDecimal baseSalary;
    
    @Column
    private BigDecimal regularHours;  // 40.0, etc.
    
    @Column
    private BigDecimal overtimeHours;
    
    @Column
    private BigDecimal overtimePay;  // 1.5x multiplier
    
    @Column
    private BigDecimal bonuses;
    
    @Column
    private BigDecimal grossPay;  // Total gross
    
    // Deductions
    @OneToMany(mappedBy = "payslip")
    private List<PayslipDeduction> deductions = new ArrayList<>();
    
    @Column
    private BigDecimal totalDeductions;
    
    // Taxes
    @Column
    private BigDecimal federalIncomeTax;
    
    @Column
    private BigDecimal stateIncomeTax;
    
    @Column
    private BigDecimal socialSecurityTax;
    
    @Column
    private BigDecimal medicareTax;
    
    @Column
    private BigDecimal totalTaxes;
    
    // Net Pay
    @Column
    private BigDecimal netPay;  // Gross - Deductions - Taxes
    
    // Status
    @Enumerated(EnumType.STRING)
    private PayslipStatus status;  // DRAFT, FINALIZED, PAID, REVERSED
    
    @Column
    private LocalDateTime paidAt;
    
    @Column
    private String pdfUrl;  // S3 path to generated PDF
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Column
    private UUID createdBy;
}

public enum PayslipStatus {
    DRAFT,
    FINALIZED,
    PAID,
    REVERSED
}
\\\

### Deduction Entity

\\\java
@Entity
@Table(name = "deductions")
public class Deduction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID tenantId;
    
    @Column(nullable = false)
    private String name;  // "Health Insurance", "401k", etc.
    
    @Enumerated(EnumType.STRING)
    private DeductionType type;  // PRE_TAX, POST_TAX, THIRD_PARTY
    
    @Column
    private BigDecimal fixedAmount;  // If fixed dollar amount
    
    @Column
    private BigDecimal percentageOfGross;  // If percentage
    
    @Column
    private Boolean isActive;
    
    @Column
    private String description;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}

public enum DeductionType {
    PRE_TAX,        // Reduces taxable income
    POST_TAX,       // After-tax deduction
    THIRD_PARTY     // Garnishment, etc.
}
\\\

## Gross-to-Net Calculation Logic

The PayrollCalculationService handles the complex calculation:

\\\
Gross Pay Calculation:
  Base Salary (pro-rated if needed) +
  Overtime Pay (hours × hourly_rate × multiplier) +
  Bonuses +
  Other Earnings
= Total Gross

Pre-Tax Deductions (reduces taxable income):
  401k contributions
  Health insurance premiums
  FSA contributions
= Taxable Income Reduction

Taxable Income:
  Total Gross - Pre-Tax Deductions
= Taxable Income

Tax Calculation:
  Federal Income Tax (using tax tables/W4 info) +
  State Income Tax (varies by state) +
  Social Security Tax (6.2% of gross, capped at \,600) +
  Medicare Tax (1.45% of gross, additional 0.9% over \) +
  Local Taxes (if applicable)
= Total Taxes

Post-Tax Deductions:
  Garnishments
  Child support
  Other post-tax items
= Total Post-Tax Deductions

Net Pay:
  Total Gross - Total Deductions - Total Taxes
= Net Pay (amount employee receives)
\\\

## Service Implementation

### PayrollService

\\\java
@Service
@Transactional
public class PayrollService {
    
    @Autowired
    private PayrollRunRepository payrollRunRepository;
    
    @Autowired
    private PayslipRepository payslipRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private PayrollCalculationService calculationService;
    
    @Autowired
    private PayslipService payslipService;
    
    @Autowired
    private AuditLogService auditLogService;
    
    @Autowired
    private TenantContext tenantContext;
    
    // 1. Create Payroll Run
    public PayrollRunResponse createPayrollRun(
        PayrollRunRequest request,
        UUID tenantId,
        UUID createdBy
    ) {
        // Validation
        validatePayrollRunRequest(request);
        
        // Check for existing payroll run in same period
        if (payrollRunRepository.existsByTenantIdAndStartDateAndEndDate(
            tenantId, request.getStartDate(), request.getEndDate())) {
            throw new BusinessException("Payroll run already exists for this period");
        }
        
        PayrollRun run = new PayrollRun();
        run.setTenantId(tenantId);
        run.setPeriodName(request.getPeriodName());
        run.setStartDate(request.getStartDate());
        run.setEndDate(request.getEndDate());
        run.setStatus(PayrollStatus.DRAFT);
        run.setPaymentMethod(request.getPaymentMethod());
        run.setCreatedBy(createdBy);
        
        PayrollRun saved = payrollRunRepository.save(run);
        
        auditLogService.logCreate("PAYROLL_RUN", saved.getId().toString(),
            "Created payroll run: " + saved.getPeriodName(),
            tenantId, createdBy);
        
        return mapToResponse(saved);
    }
    
    // 2. Calculate Payroll
    @Async
    public void calculatePayroll(UUID payrollRunId, UUID tenantId, UUID calculatedBy) {
        PayrollRun run = payrollRunRepository.findByIdAndTenantId(payrollRunId, tenantId)
            .orElseThrow(() -> new NotFoundException("Payroll run not found"));
        
        if (!run.getStatus().equals(PayrollStatus.DRAFT)) {
            throw new BusinessException("Can only calculate payroll in DRAFT status");
        }
        
        // Get all active employees in tenant
        List<Employee> employees = employeeRepository
            .findByTenantIdAndStatusAndArchivedFalse(tenantId, EmploymentStatus.ACTIVE);
        
        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalDeductions = BigDecimal.ZERO;
        BigDecimal totalTaxes = BigDecimal.ZERO;
        
        for (Employee employee : employees) {
            PayslipCalculationData data = new PayslipCalculationData();
            data.setEmployee(employee);
            data.setPayrollRun(run);
            data.setPeriodStartDate(run.getStartDate());
            data.setPeriodEndDate(run.getEndDate());
            
            // Fetch employee's time records, bonuses, deductions
            data.setRegularHours(getEmployeeRegularHours(employee.getId(), 
                run.getStartDate(), run.getEndDate()));
            data.setOvertimeHours(getEmployeeOvertimeHours(employee.getId(),
                run.getStartDate(), run.getEndDate()));
            data.setBonuses(getEmployeeBonuses(employee.getId(),
                run.getStartDate(), run.getEndDate()));
            data.setDeductions(getEmployeeDeductions(employee.getId(), tenantId));
            
            // Calculate payslip
            Payslip payslip = calculationService.calculatePayslip(data);
            payslipRepository.save(payslip);
            
            totalGross = totalGross.add(payslip.getGrossPay());
            totalDeductions = totalDeductions.add(payslip.getTotalDeductions());
            totalTaxes = totalTaxes.add(payslip.getTotalTaxes());
        }
        
        // Update payroll run summary
        run.setStatus(PayrollStatus.CALCULATED);
        run.setTotalGross(totalGross);
        run.setTotalDeductions(totalDeductions);
        run.setTotalTaxes(totalTaxes);
        run.setTotalNet(totalGross.subtract(totalDeductions).subtract(totalTaxes));
        run.setEmployeeCount(employees.size());
        
        payrollRunRepository.save(run);
        
        auditLogService.logCreate("PAYROLL_CALCULATION", payrollRunId.toString(),
            String.format("Calculated payroll for %d employees. Gross: %s",
                employees.size(), totalGross),
            tenantId, calculatedBy);
    }
    
    // 3. Approve Payroll
    public void approvePayroll(UUID payrollRunId, UUID tenantId, UUID approvedBy) {
        PayrollRun run = payrollRunRepository.findByIdAndTenantId(payrollRunId, tenantId)
            .orElseThrow(() -> new NotFoundException("Payroll run not found"));
        
        if (!run.getStatus().equals(PayrollStatus.CALCULATED)) {
            throw new BusinessException(
                "Can only approve payroll in CALCULATED status"
            );
        }
        
        run.setStatus(PayrollStatus.APPROVED);
        run.setApprovedBy(approvedBy);
        run.setApprovedAt(LocalDateTime.now());
        
        payrollRunRepository.save(run);
        
        auditLogService.logUpdate("PAYROLL_RUN", payrollRunId.toString(),
            "status: CALCULATED", "status: APPROVED",
            tenantId, approvedBy);
    }
    
    // 4. Finalize Payroll (Lock from changes)
    public void finalizePayroll(UUID payrollRunId, UUID tenantId, UUID finalizedBy) {
        PayrollRun run = payrollRunRepository.findByIdAndTenantId(payrollRunId, tenantId)
            .orElseThrow(() -> new NotFoundException("Payroll run not found"));
        
        if (!run.getStatus().equals(PayrollStatus.APPROVED)) {
            throw new BusinessException(
                "Can only finalize payroll in APPROVED status"
            );
        }
        
        run.setStatus(PayrollStatus.FINALIZED);
        run.setPaymentDate(LocalDate.now());
        
        payrollRunRepository.save(run);
        
        // Generate payslip PDFs
        List<Payslip> payslips = payslipRepository.findByPayrollRunId(payrollRunId);
        for (Payslip payslip : payslips) {
            payslipService.generatePayslipPDF(payslip);
        }
        
        auditLogService.logCreate("PAYROLL_FINALIZED", payrollRunId.toString(),
            "Payroll finalized and locked from changes",
            tenantId, finalizedBy);
    }
    
    // 5. Get Payroll Run Details
    public PayrollRunDetailResponse getPayrollRunDetails(UUID payrollRunId, UUID tenantId) {
        PayrollRun run = payrollRunRepository.findByIdAndTenantId(payrollRunId, tenantId)
            .orElseThrow(() -> new NotFoundException("Payroll run not found"));
        
        List<Payslip> payslips = payslipRepository.findByPayrollRunId(payrollRunId);
        
        PayrollRunDetailResponse response = new PayrollRunDetailResponse();
        response.setId(run.getId());
        response.setPeriodName(run.getPeriodName());
        response.setStartDate(run.getStartDate());
        response.setEndDate(run.getEndDate());
        response.setStatus(run.getStatus());
        response.setTotalGross(run.getTotalGross());
        response.setTotalDeductions(run.getTotalDeductions());
        response.setTotalTaxes(run.getTotalTaxes());
        response.setTotalNet(run.getTotalNet());
        response.setEmployeeCount(payslips.size());
        response.setPayslips(payslips.stream()
            .map(this::mapPayslipToResponse)
            .collect(Collectors.toList()));
        
        return response;
    }
    
    private void validatePayrollRunRequest(PayrollRunRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new ValidationException("Start and end dates are required");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new ValidationException("Start date cannot be after end date");
        }
        if (request.getEndDate().isAfter(LocalDate.now())) {
            throw new ValidationException("End date cannot be in the future");
        }
    }
    
    private List<BigDecimal> getEmployeeRegularHours(UUID employeeId, 
        LocalDate startDate, LocalDate endDate) {
        // Query time_attendance_service for regular hours
        // This would typically be a service-to-service call or cached data
        return new ArrayList<>();  // Placeholder
    }
    
    private List<BigDecimal> getEmployeeOvertimeHours(UUID employeeId,
        LocalDate startDate, LocalDate endDate) {
        // Query time_attendance_service for overtime hours
        return new ArrayList<>();  // Placeholder
    }
    
    private BigDecimal getEmployeeBonuses(UUID employeeId,
        LocalDate startDate, LocalDate endDate) {
        // Query for bonuses granted in period
        return BigDecimal.ZERO;  // Placeholder
    }
    
    private List<EmployeeDeduction> getEmployeeDeductions(UUID employeeId, UUID tenantId) {
        // Query employee's active deductions (401k, health insurance, etc.)
        return new ArrayList<>();  // Placeholder
    }
    
    private PayslipResponse mapPayslipToResponse(Payslip payslip) {
        return PayslipResponse.builder()
            .id(payslip.getId())
            .payslipNumber(payslip.getPayslipNumber())
            .employeeId(payslip.getEmployee().getId())
            .employeeName(payslip.getEmployee().getFirstName() + " " + 
                payslip.getEmployee().getLastName())
            .grossPay(payslip.getGrossPay())
            .totalDeductions(payslip.getTotalDeductions())
            .totalTaxes(payslip.getTotalTaxes())
            .netPay(payslip.getNetPay())
            .status(payslip.getStatus())
            .pdfUrl(payslip.getPdfUrl())
            .build();
    }
}
\\\

### PayrollCalculationService (Gross-to-Net)

\\\java
@Service
@Transactional
public class PayrollCalculationService {
    
    @Autowired
    private TaxService taxService;
    
    @Autowired
    private DeductionRepository deductionRepository;
    
    public Payslip calculatePayslip(PayslipCalculationData data) {
        Payslip payslip = new Payslip();
        payslip.setTenantId(data.getEmployee().getTenantId());
        payslip.setPayrollRun(data.getPayrollRun());
        payslip.setEmployee(data.getEmployee());
        payslip.setPayslipNumber(generatePayslipNumber(
            data.getPayrollRun().getId(),
            data.getEmployee().getId()
        ));
        
        // STEP 1: Calculate Gross Pay
        BigDecimal baseSalary = calculateBaseSalary(data.getEmployee(),
            data.getPeriodStartDate(), data.getPeriodEndDate());
        
        BigDecimal overtimePay = calculateOvertimePay(data.getEmployee(),
            data.getOvertimeHours());
        
        BigDecimal bonuses = data.getBonuses() != null ? data.getBonuses() : BigDecimal.ZERO;
        
        BigDecimal grossPay = baseSalary.add(overtimePay).add(bonuses);
        
        payslip.setBaseSalary(baseSalary);
        payslip.setRegularHours(data.getRegularHours());
        payslip.setOvertimeHours(data.getOvertimeHours());
        payslip.setOvertimePay(overtimePay);
        payslip.setBonuses(bonuses);
        payslip.setGrossPay(grossPay);
        
        // STEP 2: Get Employee Deductions
        List<EmployeeDeduction> employeeDeductions = data.getDeductions();
        BigDecimal preTaxDeductions = BigDecimal.ZERO;
        BigDecimal postTaxDeductions = BigDecimal.ZERO;
        
        List<PayslipDeduction> payslipDeductions = new ArrayList<>();
        
        for (EmployeeDeduction empDed : employeeDeductions) {
            Deduction deduction = empDed.getDeduction();
            BigDecimal amount = calculateDeductionAmount(deduction, grossPay);
            
            PayslipDeduction payslipDed = new PayslipDeduction();
            payslipDed.setPayslip(payslip);
            payslipDed.setDeduction(deduction);
            payslipDed.setAmount(amount);
            payslipDeductions.add(payslipDed);
            
            if (deduction.getType().equals(DeductionType.PRE_TAX)) {
                preTaxDeductions = preTaxDeductions.add(amount);
            } else {
                postTaxDeductions = postTaxDeductions.add(amount);
            }
        }
        
        payslip.setDeductions(payslipDeductions);
        BigDecimal totalDeductions = preTaxDeductions.add(postTaxDeductions);
        payslip.setTotalDeductions(totalDeductions);
        
        // STEP 3: Calculate Taxable Income
        BigDecimal taxableIncome = grossPay.subtract(preTaxDeductions);
        
        // STEP 4: Calculate Taxes
        TaxCalculationData taxData = new TaxCalculationData();
        taxData.setGrossPay(grossPay);
        taxData.setTaxableIncome(taxableIncome);
        taxData.setEmployee(data.getEmployee());
        taxData.setPayPeriodEndDate(data.getPeriodEndDate());
        
        TaxCalculationResult taxResult = taxService.calculateTaxes(taxData);
        
        payslip.setFederalIncomeTax(taxResult.getFederalIncomeTax());
        payslip.setStateIncomeTax(taxResult.getStateIncomeTax());
        payslip.setSocialSecurityTax(taxResult.getSocialSecurityTax());
        payslip.setMedicareTax(taxResult.getMedicareTax());
        
        BigDecimal totalTaxes = taxResult.getFederalIncomeTax()
            .add(taxResult.getStateIncomeTax())
            .add(taxResult.getSocialSecurityTax())
            .add(taxResult.getMedicareTax());
        
        payslip.setTotalTaxes(totalTaxes);
        
        // STEP 5: Calculate Net Pay
        BigDecimal netPay = grossPay
            .subtract(totalDeductions)
            .subtract(totalTaxes);
        
        payslip.setNetPay(netPay);
        payslip.setStatus(PayslipStatus.DRAFT);
        
        return payslip;
    }
    
    private BigDecimal calculateBaseSalary(Employee employee,
        LocalDate periodStart, LocalDate periodEnd) {
        if (employee.getSalary() == null) {
            return BigDecimal.ZERO;
        }
        
        // Calculate days in period
        long daysInPeriod = ChronoUnit.DAYS.between(periodStart, periodEnd) + 1;
        
        // Assume annual salary, convert to period salary
        // Standard: 260 working days per year (52 weeks × 5 days)
        BigDecimal dailyRate = employee.getSalary()
            .divide(new BigDecimal(260), 2, RoundingMode.HALF_UP);
        
        return dailyRate.multiply(new BigDecimal(daysInPeriod));
    }
    
    private BigDecimal calculateOvertimePay(Employee employee, BigDecimal overtimeHours) {
        if (overtimeHours == null || overtimeHours.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        if (employee.getSalary() == null) {
            return BigDecimal.ZERO;
        }
        
        // Hourly rate = annual salary / 2080 hours per year (40 × 52)
        BigDecimal hourlyRate = employee.getSalary()
            .divide(new BigDecimal(2080), 2, RoundingMode.HALF_UP);
        
        // Overtime = 1.5x hourly rate
        BigDecimal overtimeRate = hourlyRate.multiply(new BigDecimal("1.5"));
        
        return overtimeRate.multiply(overtimeHours);
    }
    
    private BigDecimal calculateDeductionAmount(Deduction deduction, BigDecimal grossPay) {
        if (deduction.getFixedAmount() != null) {
            return deduction.getFixedAmount();
        }
        
        if (deduction.getPercentageOfGross() != null) {
            return grossPay.multiply(deduction.getPercentageOfGross())
                .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
        }
        
        return BigDecimal.ZERO;
    }
    
    private String generatePayslipNumber(UUID payrollRunId, UUID employeeId) {
        // Format: PS-{payrollRunId-first-8}-{employeeId-first-8}}
        return String.format("PS-%s-%s",
            payrollRunId.toString().substring(0, 8),
            employeeId.toString().substring(0, 8));
    }
}
\\\

## Important Business Rules

1. **Payroll Run States**
   - Only one active payroll run per period
   - Cannot modify employees during FINALIZED status
   - Reverse button only available after APPROVED

2. **Gross-to-Net Calculation**
   - Order of operations is critical for correct tax calculation
   - Pre-tax deductions must be deducted before tax calculation
   - Post-tax deductions applied after taxes
   - Social Security tax capped at \,600 (2024)
   - Medicare tax has additional 0.9% for high earners

3. **Tax Calculation**
   - Must support multiple tax jurisdictions (federal, state, local)
   - W4 withholding info stored in employee record
   - Tax tables updated annually (usually January)
   - Garnishments treated as post-tax

4. **Approval Workflow**
   - Must go through: DRAFT → CALCULATED → APPROVED → FINALIZED
   - Cannot skip steps
   - Approval requires TENANT_ADMIN or ACCOUNTANT role
   - Approvals logged with timestamp and user ID

5. **Audit Trail**
   - Every calculation change must be logged
   - Payslip generation must be immutable once approved
   - All payroll reversals require explanation

See \TEST_STRATEGY.md\ for detailed testing approach.
