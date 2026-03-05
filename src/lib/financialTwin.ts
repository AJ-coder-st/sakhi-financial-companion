/**
 * Financial Digital Twin Module
 * Simulates and projects financial scenarios based on income, expenses, and savings
 */

export interface FinancialSnapshot {
  income: number;
  expenses: number;
  savings: number;
  monthlySavings: number;
  yearlySavings: number;
  safeLoanEMI: number;
  savingsRatio: number; // percentage
  costOfLivingRatio: number; // percentage
}

export interface FinancialProjection {
  currentMonth: FinancialSnapshot;
  sixMonths: FinancialSnapshot;
  oneyear: FinancialSnapshot;
  trend: "improving" | "declining" | "stable";
}

/**
 * Calculate current month financial snapshot
 */
export const calculateSnapshot = (
  income: number,
  expenses: number,
  currentSavings: number = 0
): FinancialSnapshot => {
  const monthlySavings = Math.max(0, income - expenses);
  const yearlySavings = monthlySavings * 12;
  
  // Safe loan EMI should not exceed 50% of monthly savings
  // This ensures people can still meet daily needs
  const safeLoanEMI = monthlySavings * 0.5;
  
  const savingsRatio = income > 0 ? (monthlySavings / income) * 100 : 0;
  const costOfLivingRatio = income > 0 ? (expenses / income) * 100 : 0;

  return {
    income,
    expenses,
    savings: currentSavings,
    monthlySavings,
    yearlySavings,
    safeLoanEMI,
    savingsRatio: Math.round(savingsRatio),
    costOfLivingRatio: Math.round(costOfLivingRatio),
  };
};

/**
 * Project financial scenario into the future
 */
export const projectFinances = (
  income: number,
  expenses: number,
  currentSavings: number = 0,
  monthsToProject: number = 12
): FinancialProjection => {
  const currentMonth = calculateSnapshot(income, expenses, currentSavings);

  // Project 6 months
  const sixMonthsSavings = currentSavings + currentMonth.monthlySavings * 6;
  const sixMonths = calculateSnapshot(income, expenses, sixMonthsSavings);

  // Project 1 year
  const oneYearSavings = currentSavings + currentMonth.yearlySavings;
  const oneyear = calculateSnapshot(income, expenses, oneYearSavings);

  // Determine trend
  let trend: "improving" | "declining" | "stable" = "stable";
  if (currentMonth.savingsRatio > 15) {
    trend = "improving";
  } else if (currentMonth.savingsRatio < 5 && currentMonth.monthlySavings < 500) {
    trend = "declining";
  }

  return {
    currentMonth,
    sixMonths,
    oneyear,
    trend,
  };
};

/**
 * Calculate max loan amount based on safe EMI
 * Using EMI formula: Loan = EMI * (number of months) / Interest factor
 */
export const calculateMaxLoanAmount = (
  income: number,
  expenses: number,
  loanDurationMonths: number = 12,
  interestRate: number = 10 // percentage per annum
): number => {
  const snapshot = calculateSnapshot(income, expenses);
  const monthlyInterestRate = interestRate / 100 / 12;

  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  // Solving for P (Principal): P = EMI / (r * (1 + r)^n / ((1 + r)^n - 1))
  const factor =
    monthlyInterestRate *
    Math.pow(1 + monthlyInterestRate, loanDurationMonths) /
    (Math.pow(1 + monthlyInterestRate, loanDurationMonths) - 1);

  const maxLoanAmount = snapshot.safeLoanEMI / factor;

  return Math.round(maxLoanAmount);
};

/**
 * Calculate EMI (Equated Monthly Installment)
 */
export const calculateEMI = (
  principal: number,
  annualInterestRate: number,
  durationMonths: number
): number => {
  const monthlyRate = annualInterestRate / 100 / 12;
  const emi =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, durationMonths)) /
    (Math.pow(1 + monthlyRate, durationMonths) - 1);

  return Math.round(emi);
};

/**
 * Financial health indicators
 */
export const getFinancialHealthIndicators = (
  income: number,
  expenses: number,
  currentDebt: number = 0
) => {
  const snapshot = calculateSnapshot(income, expenses);

  const debtRatio = income > 0 ? (currentDebt / income) * 100 : 0;
  const healthScore = Math.max(0, 100 - debtRatio - (100 - snapshot.savingsRatio));

  return {
    savingsRatio: snapshot.savingsRatio,
    debtRatio: Math.round(debtRatio),
    healthScore: Math.round(healthScore),
    isHealthy: healthScore > 60,
    recommendation:
      snapshot.savingsRatio < 10
        ? "Try to increase savings to at least 10% of income"
        : snapshot.savingsRatio < 20
          ? "Good progress! Aim for 20% savings rate"
          : "Excellent savings discipline!",
  };
};

export default {
  calculateSnapshot,
  projectFinances,
  calculateMaxLoanAmount,
  calculateEMI,
  getFinancialHealthIndicators,
};
