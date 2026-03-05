import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { AssemblyAI } from "assemblyai";

import { analyzeUserQuery, generateFinalAdvice, initializeGemini } from "../lib/gemini";
import { runFinanceTwin } from "../lib/financeTwin";
import { calculateFinancialHealth } from "../lib/financialHealthScore";
import { matchSchemes } from "../lib/schemeMatcher";
import { preprocessDocumentImage } from "../lib/documentScanner";
import { runOcrOnBuffer } from "../lib/ocrProcessor";
import { extractFinancialDataFromText } from "../lib/documentAnalyzer";
import schemesJson from "../data/schemes.json";
import lessonsJson from "../data/lessons.json";

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

// STT (AssemblyAI) - Improved Implementation
app.post("/api/stt", async (req, res) => {
  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      console.error("AssemblyAI API key not configured");
      return res.status(500).json({ 
        error: "STT service is not configured on the server. Please set ASSEMBLYAI_API_KEY environment variable." 
      });
    }

    const { audioBase64, mimeType = "audio/webm" } = req.body ?? {};
    
    // Enhanced validation
    if (!audioBase64 || typeof audioBase64 !== "string") {
      return res.status(400).json({ 
        error: "Missing or invalid audioBase64 in request body." 
      });
    }

    // Validate base64 format
    if (!audioBase64.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
      return res.status(400).json({ 
        error: "Invalid base64 audio data format." 
      });
    }

    // Initialize AssemblyAI client
    const assemblyAI = new AssemblyAI({
      apiKey: apiKey,
    });

    // Convert base64 to buffer
    let audioBuffer: Buffer;
    try {
      audioBuffer = Buffer.from(audioBase64, "base64");
      
      // Validate audio buffer size (max 25MB for AssemblyAI)
      if (audioBuffer.length > 25 * 1024 * 1024) {
        return res.status(400).json({ 
          error: "Audio file too large. Maximum size is 25MB." 
        });
      }
      
      if (audioBuffer.length === 0) {
        return res.status(400).json({ 
          error: "Audio file is empty." 
        });
      }
    } catch (error) {
      console.error("Error converting base64 to buffer:", error);
      return res.status(400).json({ 
        error: "Failed to process audio data." 
      });
    }

    console.log(`Processing audio: ${audioBuffer.length} bytes, type: ${mimeType}`);

    // Upload audio to AssemblyAI
    let uploadUrl: string;
    try {
      const uploadResponse = await assemblyAI.files.upload(audioBuffer);
      uploadUrl = uploadResponse;
      console.log("Audio uploaded successfully:", uploadUrl);
    } catch (error) {
      console.error("AssemblyAI upload error:", error);
      return res.status(500).json({ 
        error: "Failed to upload audio to AssemblyAI. Please try again." 
      });
    }

    // Create transcription request
    let transcriptId: string;
    try {
      const transcript = await assemblyAI.transcripts.create({
        audio_url: uploadUrl,
        language_detection: true,
        punctuate: true,
        format_text: true,
        auto_highlights: false,
        auto_chapters: false,
        speaker_labels: false,
        sentiment_analysis: false,
      });
      transcriptId = transcript.id;
      console.log("Transcription created:", transcriptId);
    } catch (error) {
      console.error("AssemblyAI transcript creation error:", error);
      return res.status(500).json({ 
        error: "Failed to create transcription request." 
      });
    }

    // Poll for transcription completion with improved timeout
    const maxAttempts = 30; // 45 seconds max (30 * 1.5s)
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await sleep(1500);

      try {
        const transcript = await assemblyAI.transcripts.get(transcriptId);
        console.log(`Transcription status (attempt ${attempt + 1}): ${transcript.status}`);

        if (transcript.status === "completed") {
          if (!transcript.text || transcript.text.trim().length === 0) {
            return res.status(400).json({ 
              error: "No speech detected in the audio. Please try speaking more clearly." 
            });
          }
          
          console.log("Transcription completed successfully");
          return res.json({ 
            success: true, 
            text: transcript.text.trim(),
            confidence: transcript.confidence,
            words: transcript.words?.length || 0
          });
        }

        if (transcript.status === "error") {
          console.error("Transcription failed:", transcript.error);
          return res.status(500).json({ 
            error: transcript.error || "Transcription failed. Please try again." 
          });
        }

        if (transcript.status === "queued" || transcript.status === "processing") {
          continue; // Keep polling
        }

        // Handle unexpected status
        console.warn("Unexpected transcription status:", transcript.status);
        return res.status(500).json({ 
          error: "Unexpected transcription status. Please try again." 
        });

      } catch (error) {
        console.error(`Error checking transcription status (attempt ${attempt + 1}):`, error);
        
        // If it's the last attempt, return error
        if (attempt === maxAttempts - 1) {
          return res.status(500).json({ 
            error: "Failed to check transcription status. Please try again." 
          });
        }
        
        // Otherwise continue polling
        continue;
      }
    }

    // Timeout reached
    console.error("Transcription timeout after", maxAttempts * 1.5, "seconds");
    return res.status(504).json({ 
      error: "Transcription is taking too long. Please try again with a shorter recording." 
    });

  } catch (error: any) {
    console.error("STT API error:", error);
    res.status(500).json({
      error: error?.message || "Unexpected error while processing speech-to-text.",
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

// ============================================
// LEARNING MODULE API ENDPOINTS
// ============================================

/**
 * GET /api/lessons
 * Returns all available lessons from lessons.json
 */
app.get("/api/lessons", async (req, res) => {
  try {
    res.json({
      success: true,
      lessons: lessonsJson.lessons || [],
      total: lessonsJson.lessons?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ 
      error: 'Failed to fetch lessons',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

/**
 * POST /api/lessons/complete
 * Mark a lesson as completed for a specific user
 */
app.post("/api/lessons/complete", async (req, res) => {
  try {
    const { lessonId, userId, answers } = req.body;
    
    if (!lessonId || !userId) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'lessonId and userId are required'
      });
    }
    
    // Validate lessonId is a number
    if (typeof lessonId !== 'number' || lessonId < 1) {
      return res.status(400).json({ 
        error: 'Invalid lesson ID',
        message: 'lessonId must be a positive number'
      });
    }
    
    // Validate userId is a string
    if (typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid user ID',
        message: 'userId must be a non-empty string'
      });
    }
    
    console.log('Lesson completion recorded:', { userId, lessonId, answers, completedAt: new Date() });
    
    // TODO: Connect to MongoDB
    // await db.collection('lessonCompletions').updateOne(
    //   { userId },
    //   { 
    //     $addToSet: { completedLessons: lessonId },
    //     $set: { lastUpdated: new Date() }
    //   },
    //   { upsert: true }
    // );
    
    res.json({
      success: true,
      status: 'completed',
      lessonId,
      userId,
      completedAt: new Date().toISOString(),
      message: 'Lesson marked as completed successfully'
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ 
      error: 'Failed to mark lesson complete',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

/**
 * GET /api/lessons/complete
 * Get user's completion status for all lessons
 */
app.get("/api/lessons/complete", async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Missing parameter',
        message: 'userId query parameter is required'
      });
    }
    
    // TODO: Query MongoDB for user's completion history
    // const userProgress = await db.collection('lessonCompletions')
    //   .findOne({ userId });
    // const completedLessons = userProgress?.completedLessons || [];
    
    // For now: return empty (first visit - no lessons completed)
    const completedLessons = [];
    const totalLessons = 6;
    
    res.json({
      success: true,
      userId,
      completedLessons,
      totalCompleted: completedLessons.length,
      progress: Math.round((completedLessons.length / totalLessons) * 100),
      nextUnlockedLesson: completedLessons.length + 1
    });
  } catch (error) {
    console.error('Error fetching completion status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch completion status',
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
});

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

