import { NextRequest, NextResponse } from "next/server";

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com/v2";

export const runtime = "nodejs";

interface SttRequestBody {
  audioBase64?: string;
  mimeType?: string;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    if (!ASSEMBLYAI_API_KEY) {
      return NextResponse.json(
        { error: "STT service is not configured on the server." },
        { status: 500 },
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json." },
        { status: 400 },
      );
    }

    const body = (await req.json()) as SttRequestBody;
    const audioBase64 = (body.audioBase64 || "").trim();

    if (!audioBase64) {
      return NextResponse.json(
        { error: "Missing audioBase64 in request body." },
        { status: 400 },
      );
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    // 1) Upload raw audio
    const uploadRes = await fetch(`${ASSEMBLYAI_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
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

    // 2) Create transcript
    const transcriptRes = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript`, {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
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

    // 3) Poll until completed
    for (let i = 0; i < 20; i++) {
      await sleep(1500);

      const statusRes = await fetch(
        `${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`,
        {
          headers: {
            Authorization: ASSEMBLYAI_API_KEY,
          },
        },
      );

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
        return NextResponse.json(
          { success: true, text: statusJson.text ?? "" },
          { status: 200 },
        );
      }

      if (statusJson.status === "error") {
        return NextResponse.json(
          {
            error:
              statusJson.error ||
              "AssemblyAI could not transcribe the audio. Please try again.",
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Speech-to-text is taking too long. Please try again with a shorter recording.",
      },
      { status: 504 },
    );
  } catch (error: any) {
    console.error("STT API error:", error);
    const message =
      typeof error?.message === "string"
        ? error.message
        : "Unexpected error while running speech-to-text.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

