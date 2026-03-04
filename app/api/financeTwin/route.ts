import { NextRequest, NextResponse } from "next/server";
import { runFinanceTwin } from "../../../lib/financeTwin";

export const runtime = "edge";

type FinanceTwinRequestBody = {
  income?: number;
  expenses?: number;
  savings?: number;
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

    const body = (await req.json()) as FinanceTwinRequestBody;
    const income = Number(body.income ?? 0);
    const expenses = Number(body.expenses ?? 0);
    const savings = Number(body.savings ?? 0);

    if (!Number.isFinite(income) || !Number.isFinite(expenses) || !Number.isFinite(savings)) {
      return NextResponse.json(
        { error: "Income, expenses and savings must be valid numbers." },
        { status: 400 },
      );
    }

    if (income < 0 || expenses < 0 || savings < 0) {
      return NextResponse.json(
        { error: "Income, expenses and savings cannot be negative." },
        { status: 400 },
      );
    }

    const simulation = runFinanceTwin({ income, expenses, savings });

    return NextResponse.json(
      {
        success: true,
        ...simulation,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("FinanceTwin API error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Unexpected server error while running financial simulation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

