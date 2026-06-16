package com.zynctra.payroll.service;

import com.zynctra.hr.entity.Employee;
import com.zynctra.payroll.entity.DeductionType;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayrollCalculationService {

    private final TaxService taxService;
package com.zynctra.payroll.service;

import com.zynctra.hr.entity.Employee;
import com.zynctra.payroll.entity.DeductionType;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class PayrollCalculationService {

    private final TaxService taxService;

    public PayrollCalculationService(TaxService taxService) {
        this.taxService = taxService;
    }

    /**
     * Performs the Core Gross-to-Net Calculation
     */
    public PayrollCalculationResult calculate(Employee employee, BigDecimal overtimeHours, BigDecimal bonuses, Map<String, BigDecimal> deductionsMap) {
        
        // 1. Calculate Gross Pay
        BigDecimal baseSalary = calculateBaseSalary(employee);
        BigDecimal overtimePay = calculateOvertimePay(employee, overtimeHours);
        BigDecimal grossPay = baseSalary.add(overtimePay).add(bonuses != null ? bonuses : BigDecimal.ZERO);

        // 2. Process Pre-Tax Deductions
        BigDecimal preTaxTotal = deductionsMap.getOrDefault("PRE_TAX", BigDecimal.ZERO);
        BigDecimal taxableIncome = grossPay.subtract(preTaxTotal).max(BigDecimal.ZERO);

        // 3. Calculate Taxes
        Map<String, BigDecimal> taxBreakdown = taxService.calculateTaxes(taxableIncome, grossPay);
        BigDecimal totalTaxes = taxBreakdown.get("total");

        // 4. Process Post-Tax Deductions
        BigDecimal postTaxTotal = deductionsMap.getOrDefault("POST_TAX", BigDecimal.ZERO);

        // 5. Final Net Pay Calculation
        BigDecimal totalDeductions = preTaxTotal.add(postTaxTotal);
        BigDecimal netPay = grossPay.subtract(totalTaxes).subtract(totalDeductions);

        return PayrollCalculationResult.builder()
                .grossPay(grossPay)
                .taxableIncome(taxableIncome)
                .totalTaxes(totalTaxes)
                .totalDeductions(totalDeductions)
                .netPay(netPay)
                .taxBreakdown(taxBreakdown)
                .build();
    }

    private BigDecimal calculateBaseSalary(Employee employee) {
        // Assuming bi-weekly payroll (26 periods) for this implementation
        // In production, this would use the employee's specific pay frequency
        BigDecimal annualSalary = new BigDecimal(employee.getSalaryEncrypted()); // Decrypt in actual logic
        return annualSalary.divide(new BigDecimal("26"), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateOvertimePay(Employee employee, BigDecimal hours) {
        if (hours == null || hours.compareTo(BigDecimal.ZERO) <= 0) return BigDecimal.ZERO;
        
        BigDecimal annualSalary = new BigDecimal(employee.getSalaryEncrypted());
        // Standard 2080 work hours per year
        BigDecimal hourlyRate = annualSalary.divide(new BigDecimal("2080"), 2, RoundingMode.HALF_UP);
        BigDecimal overtimeRate = hourlyRate.multiply(new BigDecimal("1.5"));
        
        return overtimeRate.multiply(hours).setScale(2, RoundingMode.HALF_UP);
    }

    @Builder
    public static class PayrollCalculationResult {
        private final BigDecimal grossPay;
        private final BigDecimal taxableIncome;
        private final BigDecimal totalTaxes;
        private final BigDecimal totalDeductions;
        private final BigDecimal netPay;
        private final Map<String, BigDecimal> taxBreakdown;

        public PayrollCalculationResult(BigDecimal grossPay, BigDecimal taxableIncome, BigDecimal totalTaxes,
                                       BigDecimal totalDeductions, BigDecimal netPay, Map<String, BigDecimal> taxBreakdown) {
            this.grossPay = grossPay;
            this.taxableIncome = taxableIncome;
            this.totalTaxes = totalTaxes;
            this.totalDeductions = totalDeductions;
            this.netPay = netPay;
            this.taxBreakdown = taxBreakdown;
        }

        public BigDecimal getGrossPay() {
            return grossPay;
        }

        public BigDecimal getTaxableIncome() {
            return taxableIncome;
        }

        public BigDecimal getTotalTaxes() {
            return totalTaxes;
        }

        public BigDecimal getTotalDeductions() {
            return totalDeductions;
        }

        public BigDecimal getNetPay() {
            return netPay;
        }

        public Map<String, BigDecimal> getTaxBreakdown() {
            return taxBreakdown;
        }

        public static PayrollCalculationResultBuilder builder() {
            return new PayrollCalculationResultBuilder();
        }

        public static class PayrollCalculationResultBuilder {
            private BigDecimal grossPay;
            private BigDecimal taxableIncome;
            private BigDecimal totalTaxes;
            private BigDecimal totalDeductions;
            private BigDecimal netPay;
            private Map<String, BigDecimal> taxBreakdown;

            public PayrollCalculationResultBuilder grossPay(BigDecimal grossPay) {
                this.grossPay = grossPay;
                return this;
            }

            public PayrollCalculationResultBuilder taxableIncome(BigDecimal taxableIncome) {
                this.taxableIncome = taxableIncome;
                return this;
            }

            public PayrollCalculationResultBuilder totalTaxes(BigDecimal totalTaxes) {
                this.totalTaxes = totalTaxes;
                return this;
            }

            public PayrollCalculationResultBuilder totalDeductions(BigDecimal totalDeductions) {
                this.totalDeductions = totalDeductions;
                return this;
            }

            public PayrollCalculationResultBuilder netPay(BigDecimal netPay) {
                this.netPay = netPay;
                return this;
            }

            public PayrollCalculationResultBuilder taxBreakdown(Map<String, BigDecimal> taxBreakdown) {
                this.taxBreakdown = taxBreakdown;
                return this;
            }

            public PayrollCalculationResult build() {
                return new PayrollCalculationResult(grossPay, taxableIncome, totalTaxes, totalDeductions, netPay, taxBreakdown);
            }
        }
    }
}
