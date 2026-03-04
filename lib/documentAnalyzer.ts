const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash-latest";

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set. Document analysis features will fail until it is configured.",
  );
}

export interface FinancialDocumentData {
  amount?: number | null;
  bank?: string | null;
  date?: string | null;
  referenceNumber?: string | null;
  purpose?: string | null;
}

async function callGeminiForDocument<T>(instruction: string, text: string): Promise<T> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${instruction}\n\nDOCUMENT TEXT:\n${text}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 256,
        },
      }),
    },
  );

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Gemini document API error: ${response.status} ${msg}`);
  }

  const json = (await response.json()) as any;
  const contentText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!contentText || typeof contentText !== "string") {
    throw new Error("Gemini returned an unexpected response for document analysis.");
  }

  try {
    return JSON.parse(contentText) as T;
  } catch {
    throw new Error("Failed to parse Gemini JSON response for document analysis.");
  }
}

export async function extractFinancialDataFromText(
  rawText: string,
): Promise<FinancialDocumentData> {
  const cleanedText = rawText.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, " ").slice(0, 8000);

  const instruction = `
You are helping extract structured information from Indian financial documents
such as bank challans, receipts, demand drafts and payment slips.

Read the OCR text and extract the following fields if present:
- amount (numeric, in rupees)
- bank (short bank name, e.g. "State Bank of India" or "SBI")
- date (DD-MM-YYYY or ISO string)
- referenceNumber (transaction id, challan no, DD no, etc.)
- purpose (short description, e.g. "fee payment", "loan EMI", "utility bill")

Return ONLY a valid JSON object with this exact TypeScript shape:
{
  "amount": number | null,
  "bank": string | null,
  "date": string | null,
  "referenceNumber": string | null,
  "purpose": string | null
}

If a field is not found, use null for that field.
Numeric values should NOT contain commas or currency symbols.
`;

  const result = await callGeminiForDocument<FinancialDocumentData>(instruction, cleanedText);

  return {
    amount:
      typeof result.amount === "number" && !Number.isNaN(result.amount)
        ? result.amount
        : null,
    bank: result.bank ?? null,
    date: result.date ?? null,
    referenceNumber: result.referenceNumber ?? null,
    purpose: result.purpose ?? null,
  };
}

