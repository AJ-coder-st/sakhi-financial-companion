import { GoogleGenerativeAI } from "@google/generative-ai";
import { detectLanguage, getLanguagePromptInstruction, type DetectedLanguage } from "../src/utils/language-detection";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Updated model names prioritized for less traffic and more stability
const PREFERRED_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-pro-latest", 
  "gemini-flash-latest"
];

let workingModel: string | null = null;

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set. Gemini-powered features will fail until it is configured.",
  );
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Function to find a working model
async function findWorkingModel(): Promise<string | null> {
  if (!genAI) return null;
  
  for (const modelName of PREFERRED_MODELS) {
    try {
      console.log(`🧪 Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Test");
      await result.response;
      console.log(`✅ Model ${modelName} is working`);
      return modelName;
    } catch (error: any) {
      console.log(`❌ Model ${modelName} failed: ${error.message}`);
    }
  }
  return null;
}

// Function to call with retry and fallback logic
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // If it's a 503 error, try a different model
      if (error.message.includes('503') || error.message.includes('high demand')) {
        console.log("🔄 Model experiencing high demand, trying fallback...");
        workingModel = null; // Reset to force model selection
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error("All retry attempts failed");
}

// Initialize working model on first use
async function getWorkingModel(): Promise<string> {
  if (workingModel) return workingModel;
  
  workingModel = await findWorkingModel();
  if (!workingModel) {
    throw new Error("No working Gemini models found. Check your API key and permissions.");
  }
  
  return workingModel;
}

// Export initialization function for server startup
export async function initializeGemini(): Promise<void> {
  if (!genAI) {
    console.warn("⚠️ Gemini AI not initialized - missing API key");
    return;
  }
  
  try {
    const model = await getWorkingModel();
    console.log(`✅ Gemini model loaded successfully: ${model}`);
  } catch (error: any) {
    console.error("❌ Failed to initialize Gemini:", error.message);
    throw error;
  }
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

// Simple text reply for direct questions
export async function callGemini(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  return await callWithRetry(async () => {
    const modelName = await getWorkingModel();
    console.log(`🤖 Using Gemini model: ${modelName}`);
    console.log(`📝 Prompt length: ${prompt.length} characters`);
    
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ Gemini response received: ${text.length} characters`);
    return text;
  });
}

// Internal helper for JSON-style responses
async function callGeminiJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  return await callWithRetry(async () => {
    const modelName = await getWorkingModel();
    console.log(`🤖 Using Gemini model for JSON: ${modelName}`);
    
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    console.log(`📝 JSON prompt length: ${prompt.length} characters`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ Gemini JSON response received: ${text.length} characters`);

    if (!text || typeof text !== "string") {
      throw new Error("Gemini API returned an unexpected response format.");
    }

    try {
      console.log("🔍 Raw Gemini response:", text);
      
      // Strip markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
      }
      
      console.log("🔧 Cleaned JSON response:", cleanText);
      return JSON.parse(cleanText) as T;
    } catch (error) {
      console.error("❌ JSON Parse Error:", error);
      console.error("❌ Response that failed to parse:", text);
      throw new Error("Failed to parse Gemini JSON response.");
    }
  });
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

  const raw = await callGeminiJson<{
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
): Promise<FinalAdviceResult & { detectedLanguage: DetectedLanguage }> {
  // Detect user's language from their query
  const languageDetection = detectLanguage(input.userQuery);
  const detectedLanguage = languageDetection.language;
  const languageInstruction = getLanguagePromptInstruction(detectedLanguage);
  
  console.log(`🔍 Detected user language: ${detectedLanguage} (confidence: ${(languageDetection.confidence * 100).toFixed(1)}%)`);
  console.log(`📊 Language breakdown:`, languageDetection.details);

  const systemPrompt = `You are SAKHI, a financial assistant designed to help users with simple financial advice.

Follow these rules strictly:

1. Answer ONLY the user's question.
2. Do NOT add extra explanations unrelated to the query.
3. Do NOT include summaries, sections, headings, or formatting unless the user asks.
4. Do NOT add translations or responses in multiple languages.
5. Respond ONLY in the language requested by the user.

Language Enforcement Rules:

• If the user asks for Tamil, respond ONLY in Tamil.
• Do not include English words when Tamil is requested.
• Use clear, natural Tamil that is easy to understand.
• The entire response must be readable aloud by Tamil text-to-speech.
• If the user asks for Hindi, respond ONLY in Hindi.
• If the user asks for Telugu, respond ONLY in Telugu.
• If the user asks for English, respond ONLY in English.

Response Style Rules:

• Keep responses short and focused.
• Avoid long paragraphs.
• Provide direct guidance related to the user's question.
• Do not repeat the question.
• Do not add extra educational content unless asked.

Output Rules:

• Output plain text only.
• No headings.
• No separators like "Summary" or "—".
• No bilingual responses.

User language: ${detectedLanguage.toUpperCase()}
User query: "${input.userQuery}"`;

  const topScheme = input.schemes[0];

  const userPrompt = `
User context:
- Monthly income: ₹${input.userContext.income}
- Monthly expenses: ₹${input.userContext.expenses}
- Occupation: ${input.userContext.occupation || "unknown"}
- Location: ${input.userContext.location || "unknown"}

Financial simulation:
- Monthly savings: ₹${input.simulation.monthlySavings}
- Yearly savings: ₹${input.simulation.yearlySavings}
- Safe loan EMI per month: ₹${input.simulation.safeLoanEMI}

Financial health:
- Score (0-100): ${input.health.financialHealthScore}
- Risk level: ${input.health.riskLevel}

Top matching scheme (if any):
- Name: ${topScheme?.name || "none"}
- Max loan: ${topScheme ? "₹" + topScheme.maxLoan : "N/A"}
- Description: ${topScheme?.description || "N/A"}

Return a JSON object ONLY:
{
  "explanation": "..."
}
`;

  const result = await callGeminiJson<{ explanation: string }>(systemPrompt, userPrompt);

  return {
    explanation: result.explanation,
    detectedLanguage
  };
}

