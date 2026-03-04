import { NextResponse } from "next/server";
import schemes from "../../../data/schemes.json";

export const runtime = "edge";

export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        schemes,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Schemes API error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Unexpected server error while fetching schemes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

