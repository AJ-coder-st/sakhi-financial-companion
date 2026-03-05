import type { IncomeStability } from "./gemini";

export interface FinancialHealthInput {
  income: number;
  expenses: number;
  existingDebtEmi?: number;
  incomeStability?: IncomeStability;
  currentSavings?: number;
  totalDebt?: number;
  dependents?: number;
}

export interface FinancialHealthResult {
  financialHealthScore: number;
  riskLevel: "low" | "medium" | "high";
  score: number;
  status: "Poor" | "Fair" | "Good" | "Excellent";
  savingsRatio: number;
  debtRatio: number;
  expenseRatio: number;
  emergencyFundMonths: number;
  advice: string[];
  issues: string[];
  strengths: string[];
}

export function calculateFinancialHealth(
  input: FinancialHealthInput,
): FinancialHealthResult {
  const income = Math.max(0, input.income);
  const expenses = Math.max(0, input.expenses);
  const existingDebtEmi = Math.max(0, input.existingDebtEmi ?? 0);
  const currentSavings = Math.max(0, input.currentSavings ?? 0);
  const totalDebt = Math.max(0, input.totalDebt ?? 0);
  const dependents = Math.max(0, input.dependents ?? 0);

  const monthlySavings = Math.max(0, income - expenses);
  const savingsRatio = income > 0 ? (monthlySavings / income) * 100 : 0;
  const debtRatio = income > 0 ? ((totalDebt + existingDebtEmi) / income) * 100 : 0;
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;
  const emergencyFundMonths =
    monthlySavings > 0 ? currentSavings / expenses : 0;

  let score = 50;
  let scoreComponents = {
    savingsScore: 0,
    debtScore: 0,
    expenseScore: 0,
    emergencyScore: 0,
  };

  // Savings ratio contribution (0–30)
  if (savingsRatio >= 30) {
    scoreComponents.savingsScore = 30;
  } else if (savingsRatio >= 20) {
    scoreComponents.savingsScore = 25;
  } else if (savingsRatio >= 15) {
    scoreComponents.savingsScore = 20;
  } else if (savingsRatio >= 10) {
    scoreComponents.savingsScore = 15;
  } else if (savingsRatio >= 5) {
    scoreComponents.savingsScore = 10;
  } else {
    scoreComponents.savingsScore = 0;
  }

  // Debt risk contribution (0–30) — lower debt is better
  if (debtRatio === 0) {
    scoreComponents.debtScore = 25;
  } else if (debtRatio <= 20) {
    scoreComponents.debtScore = 20;
  } else if (debtRatio <= 40) {
    scoreComponents.debtScore = 12;
  } else if (debtRatio <= 60) {
    scoreComponents.debtScore = 5;
  } else {
    scoreComponents.debtScore = 0;
  }

  // Expense Ratio Score (0–20)
  if (expenseRatio <= 60) {
    scoreComponents.expenseScore = 20;
  } else if (expenseRatio <= 75) {
    scoreComponents.expenseScore = 15;
  } else if (expenseRatio <= 85) {
    scoreComponents.expenseScore = 10;
  } else if (expenseRatio <= 95) {
    scoreComponents.expenseScore = 5;
  } else {
    scoreComponents.expenseScore = 0;
  }

  // Emergency Fund Score (0–20)
  if (emergencyFundMonths >= 6) {
    scoreComponents.emergencyScore = 20;
  } else if (emergencyFundMonths >= 3) {
    scoreComponents.emergencyScore = 15;
  } else if (emergencyFundMonths >= 1) {
    scoreComponents.emergencyScore = 10;
  } else if (currentSavings > 5000) {
    scoreComponents.emergencyScore = 5;
  } else {
    scoreComponents.emergencyScore = 0;
  }

  // Income stability contribution
  const stability = input.incomeStability || "medium";
  let stabilityBonus = 0;
  if (stability === "high") {
    stabilityBonus = 10;
  } else if (stability === "medium") {
    stabilityBonus = 5;
  }

  const totalScore =
    scoreComponents.savingsScore +
    scoreComponents.debtScore +
    scoreComponents.expenseScore +
    scoreComponents.emergencyScore +
    stabilityBonus;

  score = Math.max(0, Math.min(100, totalScore));

  let riskLevel: "low" | "medium" | "high" = "medium";
  let status: "Poor" | "Fair" | "Good" | "Excellent";

  if (score >= 85) {
    riskLevel = "low";
    status = "Excellent";
  } else if (score >= 65) {
    riskLevel = "low";
    status = "Good";
  } else if (score >= 40) {
    riskLevel = "medium";
    status = "Fair";
  } else {
    riskLevel = "high";
    status = "Poor";
  }

  // Generate advice and issues
  const issues: string[] = [];
  const strengths: string[] = [];
  const advice: string[] = [];

  // Analyze issues
  if (savingsRatio < 5) {
    issues.push("Very low savings rate");
    advice.push(
      `Try to save at least ₹${Math.round(income * 0.1)} per month (10% of income)`
    );
  } else if (savingsRatio < 10) {
    issues.push("Low savings rate");
    advice.push(`Increase monthly savings to ₹${Math.round(income * 0.15)} (15% of income)`);
  }

  if (debtRatio > 40) {
    issues.push("High debt burden");
    advice.push("Prioritize paying off existing debts before taking new loans");
  }

  if (expenseRatio > 90) {
    issues.push("Expenses too high");
    advice.push("Review and reduce non-essential expenses");
  }

  if (emergencyFundMonths < 1) {
    issues.push("No emergency fund");
    advice.push(`Build an emergency fund of ₹${Math.round(expenses * 3)}`);
  }

  // Analyze strengths
  if (savingsRatio >= 15) {
    strengths.push("Good savings discipline");
  }

  if (debtRatio === 0) {
    strengths.push("Debt-free");
  }

  if (expenseRatio <= 70) {
    strengths.push("Controlled spending");
  }

  if (emergencyFundMonths >= 3) {
    strengths.push("Adequate emergency fund");
  }

  // Add personalized advice
  if (monthlySavings > 2000 && savingsRatio >= 15) {
    advice.push("Consider PM Mudra Yojana for business growth");
  }

  if (dependents > 0 && debtRatio === 0) {
    advice.push("Explore health insurance for family protection");
  }

  if (issues.length === 0) {
    issues.push("No major financial concerns");
  }

  if (strengths.length === 0) {
    strengths.push("Build on your financial foundation");
  }

  return {
    financialHealthScore: Math.round(score),
    riskLevel,
    score: Math.round(score),
    status,
    savingsRatio: Math.round(savingsRatio),
    debtRatio: Math.round(debtRatio),
    expenseRatio: Math.round(expenseRatio),
    emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
    advice,
    issues,
    strengths,
  };
}

// Alias for backward compatibility
export const calculateHealthScore = calculateFinancialHealth;

/**
 * Get color indicator for health score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 85) return "text-green-600";
  if (score >= 65) return "text-blue-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
};

/**
 * Get background color for health score
 */
export const getScoreBgColor = (score: number): string => {
  if (score >= 85) return "bg-green-100";
  if (score >= 65) return "bg-blue-100";
  if (score >= 40) return "bg-yellow-100";
  return "bg-red-100";
};
