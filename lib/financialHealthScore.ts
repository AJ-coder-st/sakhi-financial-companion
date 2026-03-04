import type { IncomeStability } from "./gemini";

export interface FinancialHealthInput {
  income: number;
  expenses: number;
  existingDebtEmi?: number;
  incomeStability?: IncomeStability;
}

export interface FinancialHealthResult {
  financialHealthScore: number;
  riskLevel: "low" | "medium" | "high";
}

export function calculateFinancialHealth(
  input: FinancialHealthInput,
): FinancialHealthResult {
  const income = Math.max(0, input.income);
  const expenses = Math.max(0, input.expenses);
  const existingDebtEmi = Math.max(0, input.existingDebtEmi ?? 0);

  const monthlySavings = Math.max(0, income - expenses);
  const savingsRatio = income > 0 ? monthlySavings / income : 0;
  const debtRatio = income > 0 ? existingDebtEmi / income : 0;

  let score = 50;

  // Savings ratio contribution (0–40)
  if (savingsRatio >= 0.2) {
    score += 30; // strong savings
  } else if (savingsRatio >= 0.1) {
    score += 20; // okay savings
  } else if (savingsRatio > 0) {
    score += 10; // weak savings
  } else {
    score += 0; // no savings
  }

  // Debt risk contribution (0–30) — lower debt is better
  if (debtRatio === 0) {
    score += 25;
  } else if (debtRatio < 0.3) {
    score += 18;
  } else if (debtRatio < 0.6) {
    score += 8;
  } else {
    score += 0;
  }

  // Income stability contribution (0–30)
  const stability = input.incomeStability || "medium";
  if (stability === "high") {
    score += 25;
  } else if (stability === "medium") {
    score += 15;
  } else {
    score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  let riskLevel: "low" | "medium" | "high" = "medium";
  if (score >= 75) {
    riskLevel = "low";
  } else if (score <= 45) {
    riskLevel = "high";
  }

  return {
    financialHealthScore: Math.round(score),
    riskLevel,
  };
}

