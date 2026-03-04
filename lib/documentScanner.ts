import sharp from "sharp";

export interface ScannedImageResult {
  /** Preprocessed image as PNG buffer, optimized for OCR */
  buffer: Buffer;
  width: number;
  height: number;
}

/**
 * Lightweight, Vercel-friendly image preprocessing pipeline
 * that mirrors classic OpenCV steps (grayscale → denoise → threshold → contrast).
 *
 * This is CPU-only and avoids heavy native OpenCV bindings while
 * following the same conceptual pipeline.
 */
export async function preprocessDocumentImage(
  input: Buffer,
): Promise<ScannedImageResult> {
  // Decode image and convert to 8-bit grayscale
  let image = sharp(input, { failOnError: false }).grayscale();

  // Light blur to reduce noise (approximates OpenCV Gaussian/median blur)
  image = image.blur(0.8);

  // Adaptive-like threshold via increased contrast and hard threshold
  image = image
    .normalize() // improve global contrast
    .linear(1.2, -10) // slightly increase contrast, lower brightness
    .threshold(140); // binarize

  const processed = await image.png().toBuffer();
  const metadata = await sharp(processed).metadata();

  return {
    buffer: processed,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

