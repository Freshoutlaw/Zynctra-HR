export interface PayrollPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'PROCESSING' | 'COMPLETED';
}

export interface PayrollSummary {
  payrollPeriodId: string;
  totalPay: number;
  taxes: number;
  netTotal: number;
  processedAt?: string;
}

export interface BenefitPlan {
  id: string;
  name: string;
  description: string;
  enrollmentDeadline: string;
  active: boolean;
}
