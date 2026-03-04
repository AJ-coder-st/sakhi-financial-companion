const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set. Gemini-powered features will fail until it is configured.",
  );
}

export type IncomeStability = "low" | "medium" | "high";

export interface GeminiAnalysisResult {
  intent: string;
  income?: number;
  occupation?: string;
  location?: string;
  savings?: number;
  existingDebtEmi?: number;
  incomeStability?: IncomeStability;
}

export interface AnalyzeUserQueryInput {
  userQuery: string;
  income?: number;
  expenses?: number;
  occupation?: string;
  location?: string;
}

export interface FinalAdviceInput {
  userQuery: string;
  intent: string;
  userContext: {
    income: number;
    expenses: number;
    occupation?: string;
    location?: string;
  };
  simulation: {
    monthlySavings: number;
    yearlySavings: number;
    threeYearProjection: number;
    safeLoanEMI: number;
  };
  health: {
    financialHealthScore: number;
    riskLevel: string;
  };
  schemes: Array<{
    name: string;
    maxLoan: number;
    description: string;
    targetOccupation?: string;
    incomeLimit?: number;
    locations?: string[];
  }>;
}

export interface FinalAdviceResult {
  explanation: string;
}

async function callGemini<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 512,
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${text}`);
  }

  const json = (await response.json()) as any;
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || typeof text !== "string") {
    throw new Error("Gemini API returned an unexpected response format.");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Failed to parse Gemini JSON response.");
  }
}

export async function analyzeUserQuery(
  input: AnalyzeUserQueryInput,
): Promise<GeminiAnalysisResult> {
  const systemPrompt =
    'You are a financial advisor helping rural users in India understand loans, savings, and government schemes. Use simple language.\n' +
    "You receive the user's question and some basic numbers. Extract structured data.";

  const userPrompt = `
User question: "${input.userQuery}"
Known numbers (may be approximate):
- Income: ${input.income ?? "unknown"}
- Expenses: ${input.expenses ?? "unknown"}
- Occupation: ${input.occupation || "unknown"}
- Location: ${input.location || "unknown"}

Return a JSON object ONLY, no explanation, following this TypeScript type:
{
  "intent": "loan_inquiry" | "savings_advice" | "scheme_information" | "general_financial_advice",
  "income": number | null,
  "occupation": string | null,
  "location": string | null,
  "savings": number | null,
  "existingDebtEmi": number | null,
  "incomeStability": "low" | "medium" | "high" | null
}

If something is not clear, use null for that field. Use very simple, lower-case intent labels.
`;

  const raw = await callGemini<{
    intent: string;
    income: number | null;
    occupation: string | null;
    location: string | null;
    savings: number | null;
    existingDebtEmi: number | null;
    incomeStability: IncomeStability | null;
  }>(systemPrompt, userPrompt);

  return {
    intent: raw.intent || "general_financial_advice",
    income: typeof raw.income === "number" ? raw.income : undefined,
    occupation: raw.occupation || undefined,
    location: raw.location || undefined,
    savings: typeof raw.savings === "number" ? raw.savings : undefined,
    existingDebtEmi:
      typeof raw.existingDebtEmi === "number" ? raw.existingDebtEmi : undefined,
    incomeStability: raw.incomeStability || undefined,
  };
}

export async function generateFinalAdvice(
  input: FinalAdviceInput,
): Promise<FinalAdviceResult> {
  const systemPrompt =
    'You are a friendly financial advisor for rural communities in India. ' +
    "You explain in very simple, conversational language, avoiding jargon. " +
    "Assume the user may have low literacy, so be clear and kind. Use Indian Rupees (₹).";

  const topScheme = input.schemes[0];

  const userPrompt = `
User question: "${input.userQuery}"
Detected intent: ${input.intent}

User context:
- Monthly income: ₹${input.userContext.income}
- Monthly expenses: ₹${input.userContext.expenses}
- Occupation: ${input.userContext.occupation || "unknown"}
- Location: ${input.userContext.location || "unknown"}

Financial simulation:
- Monthly savings: ₹${input.simulation.monthlySavings}
- Yearly savings: ₹${input.simulation.yearlySavings}
- 3-year projection (if saving same amount): ₹${input.simulation.threeYearProjection}
- Safe loan EMI per month: ₹${input.simulation.safeLoanEMI}

Financial health:
- Score (0-100): ${input.health.financialHealthScore}
- Risk level: ${input.health.riskLevel}

Top matching scheme (if any):
- Name: ${topScheme?.name || "none"}
- Max loan: ${topScheme ? "₹" + topScheme.maxLoan : "N/A"}
- Description: ${topScheme?.description || "N/A"}

Other schemes count: ${input.schemes.length}

Now write a short explanation (150-250 words) that:
- Answers the user's question directly
- Explains if taking a loan is safe or risky based on safe EMI and health score
- Mentions the best government scheme (if available) and why it fits
- Gives 2-3 simple next steps (for example: save a fixed amount, visit a bank, ask about a named scheme)
- Uses very simple sentences and short paragraphs

Return a JSON object ONLY:
{
  "explanation": "..."
}
`;

  const result = await callGemini<{ explanation: string }>(systemPrompt, userPrompt);

  return {
    explanation: result.explanation,
  };
}

