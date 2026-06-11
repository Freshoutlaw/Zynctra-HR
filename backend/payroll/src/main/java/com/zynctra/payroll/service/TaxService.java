package com.zynctra.payroll.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class TaxService {

    // Standard 2024 Social Security Tax Rate (Employee portion)
    private static final BigDecimal SS_RATE = new BigDecimal("0.062");
    // Standard Medicare Tax Rate
    private static final BigDecimal MEDICARE_RATE = new BigDecimal("0.0145");
    // Placeholder Federal Income Tax Rate (Simplified for MVP)
    private static final BigDecimal PLACEHOLDER_FEDERAL_RATE = new BigDecimal("0.15");
    // Placeholder State Income Tax Rate
    private static final BigDecimal PLACEHOLDER_STATE_RATE = new BigDecimal("0.05");

    /**
     * Calculates tax breakdown based on taxable income.
     * In a production environment, this would integrate with a tax engine like Avalara or Vertex.
     */
    public Map<String, BigDecimal> calculateTaxes(BigDecimal taxableIncome, BigDecimal grossPay) {
        Map<String, BigDecimal> taxes = new HashMap<>();

        // FICA Taxes (Based on Gross Pay usually, but simplified here)
        BigDecimal socialSecurity = grossPay.multiply(SS_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal medicare = grossPay.multiply(MEDICARE_RATE).setScale(2, RoundingMode.HALF_UP);

        // Income Taxes (Based on Taxable Income)
        BigDecimal federalTax = taxableIncome.multiply(PLACEHOLDER_FEDERAL_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal stateTax = taxableIncome.multiply(PLACEHOLDER_STATE_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalTaxes = socialSecurity.add(medicare).add(federalTax).add(stateTax);

        taxes.put("socialSecurity", socialSecurity);
        taxes.put("medicare", medicare);
        taxes.put("federal", federalTax);
        taxes.put("state", stateTax);
        taxes.put("total", totalTaxes);

        return taxes;
    }
}