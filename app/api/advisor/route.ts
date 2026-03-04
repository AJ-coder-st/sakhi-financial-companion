import { NextRequest, NextResponse } from "next/server";
import { analyzeUserQuery, generateFinalAdvice } from "../../../lib/gemini";
import { runFinanceTwin } from "../../../lib/financeTwin";
import { calculateFinancialHealth } from "../../../lib/financialHealthScore";
import { matchSchemes } from "../../../lib/schemeMatcher";

export const runtime = "edge";

type AdvisorRequestBody = {
  userQuery?: string;
  income?: number;
  expenses?: number;
  occupation?: string;
  location?: string;
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as AdvisorRequestBody;
    const userQuery = (body.userQuery || "").toString().trim();
    const income = Number(body.income ?? 0);
    const expenses = Number(body.expenses ?? 0);
    const occupation = (body.occupation || "").toString().trim();
    const location = (body.location || "").toString().trim();

    if (!userQuery) {
      return NextResponse.json(
        { error: "Missing userQuery. Please provide your question or request." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(income) || !Number.isFinite(expenses)) {
      return NextResponse.json(
        { error: "Income and expenses must be valid numbers." },
        { status: 400 },
      );
    }

    if (income < 0 || expenses < 0) {
      return NextResponse.json(
        { error: "Income and expenses cannot be negative." },
        { status: 400 },
      );
    }

    // 1. Analyze query and extract structured context
    const geminiAnalysis = await analyzeUserQuery({
      userQuery,
      income,
      expenses,
      occupation,
      location,
    });

    const effectiveIncome =
      typeof geminiAnalysis.income === "number" && geminiAnalysis.income > 0
        ? geminiAnalysis.income
        : income;

    const simulation = runFinanceTwin({
      income: effectiveIncome,
      expenses,
      savings: geminiAnalysis.savings ?? 0,
    });

    const health = calculateFinancialHealth({
      income: effectiveIncome,
      expenses,
      existingDebtEmi: geminiAnalysis.existingDebtEmi ?? 0,
      incomeStability: geminiAnalysis.incomeStability ?? "medium",
    });

    const schemes = await matchSchemes({
      income: effectiveIncome,
      occupation: geminiAnalysis.occupation || occupation,
      location: geminiAnalysis.location || location,
    });

    const finalAdvice = await generateFinalAdvice({
      userQuery,
      intent: geminiAnalysis.intent,
      userContext: {
        income: effectiveIncome,
        expenses,
        occupation: geminiAnalysis.occupation || occupation,
        location: geminiAnalysis.location || location,
      },
      simulation,
      health,
      schemes,
    });

    return NextResponse.json(
      {
        success: true,
        recommendation: schemes[0]?.name || null,
        loanLimit: schemes[0]?.maxLoan || null,
        safeEMI: simulation.safeLoanEMI,
        yearlySavings: simulation.yearlySavings,
        financialHealthScore: health.financialHealthScore,
        riskLevel: health.riskLevel,
        intent: geminiAnalysis.intent,
        schemes,
        financeTwin: simulation,
        financialHealth: health,
        explanation: finalAdvice.explanation,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Advisor API error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Unexpected server error while processing advice.";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}

