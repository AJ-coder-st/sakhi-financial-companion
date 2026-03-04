/**
 * Language Detection System
 * Detects the primary language of user input text
 */

export type DetectedLanguage = 'en' | 'hi' | 'ta' | 'te';

export interface LanguageDetectionResult {
  language: DetectedLanguage;
  confidence: number;
  details: {
    englishChars: number;
    hindiChars: number;
    tamilChars: number;
    teluguChars: number;
    totalChars: number;
  };
}

/**
 * Unicode ranges for different languages
 */
const LANGUAGE_PATTERNS = {
  // Devanagari script (Hindi)
  hindi: /[\u0900-\u097F]/g,
  // Tamil script
  tamil: /[\u0B80-\u0BFF]/g,
  // Telugu script
  telugu: /[\u0C00-\u0C7F]/g,
  // Latin script (English)
  latin: /[a-zA-Z]/g
};

/**
 * Detect the primary language of a text string
 */
export function detectLanguage(text: string): LanguageDetectionResult {
  if (!text || typeof text !== 'string') {
    return {
      language: 'en',
      confidence: 0,
      details: {
        englishChars: 0,
        hindiChars: 0,
        tamilChars: 0,
        teluguChars: 0,
        totalChars: 0
      }
    };
  }

  // Count characters in each language
  const englishMatches = text.match(LANGUAGE_PATTERNS.latin) || [];
  const hindiMatches = text.match(LANGUAGE_PATTERNS.hindi) || [];
  const tamilMatches = text.match(LANGUAGE_PATTERNS.tamil) || [];
  const teluguMatches = text.match(LANGUAGE_PATTERNS.telugu) || [];

  const englishChars = englishMatches.length;
  const hindiChars = hindiMatches.length;
  const tamilChars = tamilMatches.length;
  const teluguChars = teluguMatches.length;
  const totalChars = englishChars + hindiChars + tamilChars + teluguChars;

  // Determine primary language based on character count
  let language: DetectedLanguage = 'en';
  let maxChars = englishChars;

  if (hindiChars > maxChars) {
    language = 'hi';
    maxChars = hindiChars;
  }
  if (tamilChars > maxChars) {
    language = 'ta';
    maxChars = tamilChars;
  }
  if (teluguChars > maxChars) {
    language = 'te';
    maxChars = teluguChars;
  }

  // Calculate confidence
  const confidence = totalChars > 0 ? maxChars / totalChars : 0;

  return {
    language,
    confidence,
    details: {
      englishChars,
      hindiChars,
      tamilChars,
      teluguChars,
      totalChars
    }
  };
}

/**
 * Get language name for display
 */
export function getLanguageName(lang: DetectedLanguage): string {
  const names = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)'
  };
  return names[lang] || 'Unknown';
}

/**
 * Get TTS language code
 */
export function getTTSLanguageCode(lang: DetectedLanguage): string {
  const codes = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN'
  };
  return codes[lang] || 'en-IN';
}

/**
 * Get AI prompt language instruction
 */
export function getLanguagePromptInstruction(lang: DetectedLanguage): string {
  const instructions = {
    en: "Respond only in English. Do not mix languages or include translations. Provide a short, direct answer focused only on the user's query.",
    hi: "केवल हिन्दी में जवाब दें। भाषाओं को मिलाएं नहीं और अनुवाद शामिल न करें। उपयोगकर्ता की क्वेरी पर केवल ध्यान केंद्रित करके एक छोटा, सीधा उत्तर दें।",
    ta: "தமிழில் மட்டும் பதிலளிக்கவும். மொழிகளைக் கலக்காதீர்கள் மற்றும் மொழிபெயர்ப்புகளைச் சேர்க்காதீர்கள். பயனரின் வினவலில் மட்டும் கவனம் செலுத்தி ஒரு சிறிய, நேரடியப் பதிலை வழங்கவும்.",
    te: "తెలుగులో మాత్రమే స్పందించండి. భాషలను కలపకండి మరియు అనువాదాలను చేర్చకండి. వినియోగదారుని ప్రశ్నపై మాత్రమే దృష్టి సారించి చిన్న, నేరుగా సమాధానం ఇవ్వండి."
  };
  return instructions[lang] || instructions.en;
}
