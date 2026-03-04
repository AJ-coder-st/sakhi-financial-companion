export interface FinanceTwinInput {
  income: number;
  expenses: number;
  savings: number;
}

export interface FinanceTwinResult {
  monthlySavings: number;
  yearlySavings: number;
  threeYearProjection: number;
  safeLoanEMI: number;
}

export function runFinanceTwin(input: FinanceTwinInput): FinanceTwinResult {
  const income = sanitizeNumber(input.income);
  const expenses = sanitizeNumber(input.expenses);
  const savings = sanitizeNumber(input.savings);

  const monthlySavings = Math.max(0, income - expenses);
  const yearlySavings = monthlySavings * 12 + savings;
  const threeYearProjection = yearlySavings * 3;
  const safeLoanEMI = monthlySavings * 0.5;

  return {
    monthlySavings: roundToTwo(monthlySavings),
    yearlySavings: roundToTwo(yearlySavings),
    threeYearProjection: roundToTwo(threeYearProjection),
    safeLoanEMI: roundToTwo(safeLoanEMI),
  };
}

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  return value;
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

