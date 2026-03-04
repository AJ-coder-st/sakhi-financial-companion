import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { analyzeUserQuery, generateFinalAdvice, initializeGemini } from "../lib/gemini";
import { runFinanceTwin } from "../lib/financeTwin";
import { calculateFinancialHealth } from "../lib/financialHealthScore";
import { matchSchemes } from "../lib/schemeMatcher";
import { preprocessDocumentImage } from "../lib/documentScanner";
import { runOcrOnBuffer } from "../lib/ocrProcessor";
import { extractFinancialDataFromText } from "../lib/documentAnalyzer";
import schemesJson from "../data/schemes.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Multer for multipart/form-data file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "IRAIVI API server running" });
});

// Advisor endpoint (Gemini + finance twin + schemes)
app.post("/api/advisor", async (req, res) => {
  try {
    const { userQuery, income, expenses, occupation, location } = req.body ?? {};

    if (!userQuery || typeof userQuery !== "string") {
      return res.status(400).json({
        error: "Missing userQuery. Please provide your question or request.",
      });
    }

    const numericIncome = Number(income ?? 0);
    const numericExpenses = Number(expenses ?? 0);

    if (!Number.isFinite(numericIncome) || !Number.isFinite(numericExpenses)) {
      return res
        .status(400)
        .json({ error: "Income and expenses must be valid numbers." });
    }

    if (numericIncome < 0 || numericExpenses < 0) {
      return res
        .status(400)
        .json({ error: "Income and expenses cannot be negative." });
    }

    console.log("🚀 Processing advisor request:", { userQuery: userQuery.substring(0, 100) + "...", income, expenses, occupation, location });
    
    const analysis = await analyzeUserQuery({
      userQuery,
      income: numericIncome,
      expenses: numericExpenses,
      occupation,
      location,
    });

    const effectiveIncome =
      typeof analysis.income === "number" && analysis.income > 0
        ? analysis.income
        : numericIncome;

    const simulation = runFinanceTwin({
      income: effectiveIncome,
      expenses: numericExpenses,
      savings: analysis.savings ?? 0,
    });

    const health = calculateFinancialHealth({
      income: effectiveIncome,
      expenses: numericExpenses,
      existingDebtEmi: analysis.existingDebtEmi ?? 0,
      incomeStability: analysis.incomeStability ?? "medium",
    });

    const schemes = await matchSchemes({
      income: effectiveIncome,
      occupation: analysis.occupation || occupation,
      location: analysis.location || location,
    });

    const finalAdvice = await generateFinalAdvice({
      userQuery,
      intent: analysis.intent,
      userContext: {
        income: effectiveIncome,
        expenses: numericExpenses,
        occupation: analysis.occupation || occupation,
        location: analysis.location || location,
      },
      simulation,
      health,
      schemes,
    });

    const payload = {
      recommendation: schemes[0]?.name || null,
      loanLimit: schemes[0]?.maxLoan || null,
      safeEMI: simulation.safeLoanEMI,
      yearlySavings: simulation.yearlySavings,
      financialHealthScore: health.financialHealthScore,
      riskLevel: health.riskLevel,
      intent: analysis.intent,
      schemes,
      financeTwin: simulation,
      financialHealth: health,
      explanation: finalAdvice.explanation,
      detectedLanguage: finalAdvice.detectedLanguage || 'en',
    };

    console.log("✅ AI request processed successfully");
    
    res.json({
      success: true,
      message: finalAdvice.explanation,
      data: payload,
      ...payload,
    });
  } catch (error: any) {
    console.error("Advisor API error:", error);
    res.status(500).json({
      error:
        typeof error?.message === "string"
          ? error.message
          : "Unexpected server error while processing advice.",
    });
  }
});

// Finance twin only
app.post("/api/financeTwin", (req, res) => {
  try {
    const { income, expenses, savings = 0 } = req.body ?? {};
    const numericIncome = Number(income ?? 0);
    const numericExpenses = Number(expenses ?? 0);
    const numericSavings = Number(savings ?? 0);

    if (
      !Number.isFinite(numericIncome) ||
      !Number.isFinite(numericExpenses) ||
      !Number.isFinite(numericSavings)
    ) {
      return res.status(400).json({
        error: "Income, expenses and savings must be valid numbers.",
      });
    }

    if (numericIncome < 0 || numericExpenses < 0 || numericSavings < 0) {
      return res
        .status(400)
        .json({ error: "Income, expenses and savings cannot be negative." });
    }

    const simulation = runFinanceTwin({
      income: numericIncome,
      expenses: numericExpenses,
      savings: numericSavings,
    });

    res.json({ success: true, ...simulation });
  } catch (error: any) {
    console.error("FinanceTwin API error:", error);
    res.status(500).json({
      error:
        typeof error?.message === "string"
          ? error.message
          : "Unexpected server error while running financial simulation.",
    });
  }
});

// Schemes list
app.get("/api/schemes", (_req, res) => {
  try {
    res.json({ success: true, schemes: schemesJson });
  } catch (error: any) {
    console.error("Schemes API error:", error);
    res.status(500).json({
      error:
        typeof error?.message === "string"
          ? error.message
          : "Unexpected server error while fetching schemes.",
    });
  }
});

// STT (AssemblyAI)
app.post("/api/stt", async (req, res) => {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "STT service is not configured on the server." });
    }

    const { audioBase64 } = req.body ?? {};
    if (!audioBase64 || typeof audioBase64 !== "string") {
      return res
        .status(400)
        .json({ error: "Missing audioBase64 in request body." });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");
    const baseUrl = "https://api.assemblyai.com/v2";

    const uploadRes = await fetch(`${baseUrl}/upload`, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Transfer-Encoding": "chunked",
      },
      body: audioBuffer,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      throw new Error(`AssemblyAI upload error: ${uploadRes.status} ${text}`);
    }

    const uploadJson = (await uploadRes.json()) as { upload_url: string };
    const uploadUrl = uploadJson.upload_url;

    const transcriptRes = await fetch(`${baseUrl}/transcript`, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: uploadUrl,
        language_detection: true,
        punctuate: true,
        format_text: true,
      }),
    });

    if (!transcriptRes.ok) {
      const text = await transcriptRes.text();
      throw new Error(
        `AssemblyAI transcript create error: ${transcriptRes.status} ${text}`,
      );
    }

    const transcriptJson = (await transcriptRes.json()) as { id: string };
    const transcriptId = transcriptJson.id;

    // Poll for completion (simple loop)
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    for (let i = 0; i < 20; i++) {
      await sleep(1500);

      const statusRes = await fetch(`${baseUrl}/transcript/${transcriptId}`, {
        headers: { Authorization: apiKey },
      });

      if (!statusRes.ok) {
        const text = await statusRes.text();
        throw new Error(
          `AssemblyAI transcript status error: ${statusRes.status} ${text}`,
        );
      }

      const statusJson = (await statusRes.json()) as {
        status: string;
        text?: string;
        error?: string;
      };

      if (statusJson.status === "completed") {
        return res.json({ success: true, text: statusJson.text ?? "" });
      }

      if (statusJson.status === "error") {
        return res.status(500).json({
          error:
            statusJson.error ||
            "AssemblyAI could not transcribe the audio. Please try again.",
        });
      }
    }

    return res.status(504).json({
      error:
        "Speech-to-text is taking too long. Please try again with a shorter recording.",
    });
  } catch (error: any) {
    console.error("STT API error:", error);
    res.status(500).json({
      error:
        typeof error?.message === "string"
          ? error.message
          : "Unexpected error while running speech-to-text.",
    });
  }
});

// Document scan (upload)
app.post(
  "/api/scanDocument",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = (req as any).file as { buffer: Buffer; mimetype: string } | undefined;

      if (!file) {
        return res.status(400).json({
          error: "Missing file field. Please upload a PNG or JPEG image.",
        });
      }

      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
        return res.status(400).json({
          error:
            "Unsupported file type. Please upload PNG or JPEG images of financial documents.",
        });
      }

      const { buffer } = file;

      const { buffer: processedBuffer } = await preprocessDocumentImage(buffer);
      const ocr = await runOcrOnBuffer(processedBuffer);
      const detectedText = ocr.text;

      if (!detectedText) {
        return res.status(422).json({
          error:
            "Could not detect any readable text in the document. Please upload a clearer image.",
        });
      }

      const structured = await extractFinancialDataFromText(detectedText);

      res.json({
        success: true,
        detectedText,
        amount: structured.amount ?? null,
        bank: structured.bank ?? null,
        date: structured.date ?? null,
        referenceNumber: structured.referenceNumber ?? null,
        purpose: structured.purpose ?? null,
      });
    } catch (error: any) {
      console.error("scanDocument API error:", error);
      res.status(500).json({
        error:
          typeof error?.message === "string"
            ? error.message
            : "Unexpected server error while scanning document.",
      });
    }
  },
);

app.listen(port, async () => {
  console.log(`IRAIVI API server listening on http://localhost:${port}`);
  
  // Initialize Gemini on server startup
  try {
    await initializeGemini();
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    console.log("Server will continue running, but AI features may not work.");
  }
});

