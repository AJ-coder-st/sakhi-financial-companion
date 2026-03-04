import { NextRequest, NextResponse } from "next/server";
import { generateSimpleReply } from "../../../lib/gemini";

export const runtime = "edge";

type AdvisorRequestBody = {
  query?: string;
  userQuery?: string;
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
    const query = (body.query || body.userQuery || "").toString().trim();

    if (!query) {
      return NextResponse.json(
        { error: "Missing query. Please provide your financial question." },
        { status: 400 },
      );
    }

    const replyText = await generateSimpleReply(
      `You are a financial advisor for rural users in India. Use simple Hindi+English mixed language and explain clearly.\n\nUser question: ${query}`,
    );

    return NextResponse.json(
      {
        reply: replyText,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Advisor API error:", error);
    return NextResponse.json(
      {
        reply:
          "Sorry, the AI assistant is temporarily unavailable. Please try again in a few minutes.",
      },
      { status: 200 },
    );
  }
}

