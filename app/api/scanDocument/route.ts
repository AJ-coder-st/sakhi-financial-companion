import { NextRequest, NextResponse } from "next/server";
import { preprocessDocumentImage } from "../../../lib/documentScanner";
import { runOcrOnBuffer } from "../../../lib/ocrProcessor";
import { extractFinancialDataFromText } from "../../../lib/documentAnalyzer";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"]);

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected multipart/form-data with an image file." },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing file field. Please upload a PNG or JPEG image." },
        { status: 400 },
      );
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload PNG or JPEG images of financial documents.",
        },
        { status: 400 },
      );
    }

    const size = file.size;
    if (size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            "File too large. Please upload an image smaller than 5 MB to keep processing fast.",
        },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Preprocess with a lightweight OpenCV-style pipeline
    const { buffer: processedBuffer } = await preprocessDocumentImage(buffer);

    // 2. Run OCR
    const ocr = await runOcrOnBuffer(processedBuffer);
    const detectedText = ocr.text;

    if (!detectedText) {
      return NextResponse.json(
        {
          error:
            "Could not detect any readable text in the document. Please upload a clearer image.",
        },
        { status: 422 },
      );
    }

    // 3. Analyze with Gemini to produce structured financial data
    const structured = await extractFinancialDataFromText(detectedText);

    return NextResponse.json(
      {
        success: true,
        detectedText,
        amount: structured.amount ?? null,
        bank: structured.bank ?? null,
        date: structured.date ?? null,
        referenceNumber: structured.referenceNumber ?? null,
        purpose: structured.purpose ?? null,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("scanDocument API error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Unexpected server error while scanning document.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

