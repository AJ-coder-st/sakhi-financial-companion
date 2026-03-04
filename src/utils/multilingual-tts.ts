/**
 * Multilingual Text-to-Speech System
 * Handles mixed-language content by detecting language segments and using appropriate voices
 */

import { getTTSLanguageCode as getLanguageCode } from './language-detection';

export interface LanguageSegment {
  text: string;
  lang: 'en' | 'hi' | 'ta' | 'te';
  startIndex: number;
  endIndex: number;
}

export interface TTSSystem {
  speak: (text: string) => void;
  isSupported: () => boolean;
  getAvailableVoices: () => SpeechSynthesisVoice[];
}

// Re-export the language code function
export { getTTSLanguageCode } from './language-detection';

/**
 * Unicode ranges for Indian languages
 */
const LANGUAGE_PATTERNS = {
  // Devanagari script (Hindi)
  hindi: /[\u0900-\u097F]/,
  // Tamil script
  tamil: /[\u0B80-\u0BFF]/,
  // Telugu script  
  telugu: /[\u0C00-\u0C7F]/,
  // Common Indian numerals and symbols
  indian: /[\u0966-\u096F\u09E6-\u09EF]/g
};

/**
 * Detect language of a single character
 */
function detectCharLanguage(char: string): 'en' | 'hi' | 'ta' | 'te' {
  if (LANGUAGE_PATTERNS.hindi.test(char)) return 'hi';
  if (LANGUAGE_PATTERNS.tamil.test(char)) return 'ta';
  if (LANGUAGE_PATTERNS.telugu.test(char)) return 'te';
  return 'en';
}

/**
 * Split text into language segments
 */
export function splitTextByLanguage(text: string): LanguageSegment[] {
  const segments: LanguageSegment[] = [];
  
  let currentText = '';
  let currentLang: 'en' | 'hi' | 'ta' | 'te' = 'en';
  let startIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charLang = detectCharLanguage(char);
    
    // If language changes, save current segment
    if (charLang !== currentLang && currentText.trim()) {
      segments.push({
        text: currentText.trim(),
        lang: currentLang,
        startIndex,
        endIndex: i - 1
      });
      
      currentText = '';
      startIndex = i;
      currentLang = charLang;
    }
    
    currentText += char;
  }
  
  // Add final segment
  if (currentText.trim()) {
    segments.push({
      text: currentText.trim(),
      lang: currentLang,
      startIndex,
      endIndex: text.length - 1
    });
  }
  
  return segments;
}

/**
 * Get best available voice for a language
 */
function getBestVoice(targetLang: 'en' | 'hi' | 'ta' | 'te'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  if (!('speechSynthesis' in window)) return null;
  
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  
  // Language code mappings
  const langCodes = {
    en: ['en-US', 'en-GB', 'en'],
    hi: ['hi-IN', 'hi'],
    ta: ['ta-IN', 'ta'], 
    te: ['te-IN', 'te']
  };
  
  // Try exact matches first
  for (const langCode of langCodes[targetLang]) {
    const voice = voices.find(v => v.lang === langCode);
    if (voice) return voice;
  }
  
  // Try broader matches
  const baseLang = targetLang.split('-')[0];
  const broaderVoice = voices.find(v => v.lang.startsWith(baseLang));
  if (broaderVoice) return broaderVoice;
  
  // Fallback to English
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  return englishVoice || voices[0];
}

/**
 * Create utterance with optimal settings
 */
function createUtterance(text: string, lang: 'en' | 'hi' | 'ta' | 'te'): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Language-specific settings
  const langSettings = {
    en: { lang: 'en-US', rate: 1.0, pitch: 1.0 },
    hi: { lang: 'hi-IN', rate: 0.85, pitch: 1.0 },
    ta: { lang: 'ta-IN', rate: 0.9, pitch: 1.0 },
    te: { lang: 'te-IN', rate: 0.9, pitch: 1.0 }
  };
  
  const settings = langSettings[lang];
  utterance.lang = settings.lang;
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  utterance.volume = 1.0;
  
  return utterance;
}

/**
 * Main multilingual TTS function
 */
export function createMultilingualTTS(): TTSSystem {
  return {
    isSupported: () => {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    },
    
    getAvailableVoices: () => {
      if (!('speechSynthesis' in window)) return [];
      return window.speechSynthesis.getVoices();
    },
    
    speak: (text: string) => {
      if (!text || !text.trim()) return;
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Split text into language segments
      const segments = splitTextByLanguage(text);
      
      console.log('🔍 TTS Language Segments:', segments.map(s => ({
        text: s.text.substring(0, 30) + (s.text.length > 30 ? '...' : ''),
        lang: s.lang,
        length: s.text.length
      })));
      
      // Speak each segment with appropriate voice
      segments.forEach((segment, index) => {
        setTimeout(() => {
          speakSegment(segment);
        }, index * 150); // 150ms delay between segments
      });
    }
  };
}

/**
 * Speak a single language segment
 */
function speakSegment(segment: LanguageSegment): void {
  const voice = getBestVoice(segment.lang);
  const utterance = createUtterance(segment.text, segment.lang);
  
  if (voice) {
    utterance.voice = voice;
    console.log(`🗣️ Speaking ${segment.lang.toUpperCase()}: "${segment.text.substring(0, 30)}${segment.text.length > 30 ? '...' : ''}" with voice: ${voice.name} (${voice.lang})`);
  } else {
    console.warn(`⚠️ No voice found for ${segment.lang}, using default`);
  }
  
  // Event handlers
  utterance.onstart = () => {
    console.log(`🎤 Started ${segment.lang.toUpperCase()} segment`);
  };
  
  utterance.onend = () => {
    console.log(`🔇 Finished ${segment.lang.toUpperCase()} segment`);
  };
  
  utterance.onerror = (event) => {
    console.error(`❌ TTS Error for ${segment.lang}:`, event);
    
    // Fallback to English if non-English fails
    if (segment.lang !== 'en') {
      console.log(`🔄 Falling back to English for: "${segment.text}"`);
      const fallbackUtterance = createUtterance(segment.text, 'en');
      const englishVoice = getBestVoice('en');
      if (englishVoice) fallbackUtterance.voice = englishVoice;
      window.speechSynthesis.speak(fallbackUtterance);
    }
  };
  
  window.speechSynthesis.speak(utterance);
}

/**
 * Initialize TTS system and preload voices
 */
export function initializeTTS(): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('⚠️ Speech synthesis not supported');
      resolve();
      return;
    }
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log(`🗣️ TTS Initialized: ${voices.length} voices available`);
      
      // Log available voices by language
      const voicesByLang = voices.reduce((acc, voice) => {
        const lang = voice.lang.split('-')[0];
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(voice.name);
        return acc;
      }, {} as Record<string, string[]>);
      
      console.log('🗣️ Voices by language:', voicesByLang);
      resolve();
    };
    
    // Try immediate load
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  });
}
