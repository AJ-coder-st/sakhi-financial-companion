import Tesseract from "tesseract.js";

export interface OcrResult {
  text: string;
  confidence: number;
}

/**
 * Runs Tesseract OCR on a preprocessed image buffer.
 * The buffer should be a PNG or JPEG optimized for text contrast.
 */
export async function runOcrOnBuffer(buffer: Buffer): Promise<OcrResult> {
  const { data } = await Tesseract.recognize(buffer, "eng", {
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
  } as any);

  const text = (data.text || "").trim();
  const confidence = data.confidence ?? 0;

  return { text, confidence };
}

