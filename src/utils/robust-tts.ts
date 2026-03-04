/**
 * Robust Multilingual Text-to-Speech System with Cloud Fallback
 * Ensures all languages from Gemini API are spoken correctly
 */

// Re-export types for compatibility
export type DetectedLanguage = 'en' | 'hi' | 'ta' | 'te';

export type Language = DetectedLanguage;

export interface TTSDebugInfo {
  detectedLanguage: Language;
  availableVoices: number;
  selectedVoice: string;
  textLength: number;
  langCode: string;
  success: boolean;
  ttsMethod: 'browser' | 'cloud' | 'failed';
}

/**
 * Unicode ranges for language detection
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
 * Language code mappings for cloud TTS
 */
const CLOUD_LANGUAGE_CODES = {
  en: 'en',
  hi: 'hi',
  ta: 'ta',
  te: 'te'
};

/**
 * Detect language of text using Unicode character analysis
 */
export function detectLanguage(text: string): Language {
  if (!text || typeof text !== 'string') return 'en';

  // Count characters in each language
  const hindiMatches = text.match(LANGUAGE_PATTERNS.hindi) || [];
  const tamilMatches = text.match(LANGUAGE_PATTERNS.tamil) || [];
  const teluguMatches = text.match(LANGUAGE_PATTERNS.telugu) || [];
  const englishMatches = text.match(LANGUAGE_PATTERNS.latin) || [];

  const counts = {
    en: englishMatches.length,
    hi: hindiMatches.length,
    ta: tamilMatches.length,
    te: teluguMatches.length
  };

  // Determine primary language
  let maxLang: Language = 'en';
  let maxCount = counts.en;

  for (const [lang, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxLang = lang as Language;
      maxCount = count;
    }
  }

  console.log(`🔍 Language detection: ${JSON.stringify(counts)} → ${maxLang}`);
  return maxLang;
}

/**
 * Get language code for TTS
 */
export function getLanguageCode(language: Language): string {
  const codes = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN'
  };
  return codes[language] || 'en-IN';
}

/**
 * Load voices with proper error handling and timeout
 */
export async function loadVoices(timeout: number = 5000): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      console.log(`🗣️ Voices already loaded: ${voices.length} voices`);
      resolve(voices);
      return;
    }

    console.log('⏳ Waiting for voices to load...');
    
    let voicesLoaded = false;
    const timeoutId = setTimeout(() => {
      if (!voicesLoaded) {
        console.warn('⚠️ Voice loading timeout, using empty list');
        resolve([]);
      }
    }, timeout);

    const handleVoicesChanged = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      console.log(`🗣️ Voices loaded: ${loadedVoices.length} voices`);
      
      // Log available voices by language
      const voicesByLang = loadedVoices.reduce((acc, voice) => {
        const lang = voice.lang.split('-')[0];
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(voice.name);
        return acc;
      }, {} as Record<string, string[]>);
      
      console.log('🗣️ Available voices by language:', voicesByLang);
      
      voicesLoaded = true;
      clearTimeout(timeoutId);
      window.speechSynthesis.onvoiceschanged = null;
      resolve(loadedVoices);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
  });
}

/**
 * Check if a voice exists for a specific language
 */
export function hasVoiceForLanguage(voices: SpeechSynthesisVoice[], language: Language): boolean {
  const langCode = getLanguageCode(language);
  
  // Try exact match first
  if (voices.find(v => v.lang === langCode)) {
    console.log(`✅ Found exact voice match for ${language}: ${langCode}`);
    return true;
  }

  // Try language prefix match
  if (voices.find(v => v.lang.startsWith(language))) {
    console.log(`✅ Found prefix voice match for ${language}: ${language}`);
    return true;
  }

  console.log(`❌ No voice found for ${language} (${langCode})`);
  return false;
}

/**
 * Find best voice for a language
 */
export function findBestVoice(voices: SpeechSynthesisVoice[], language: Language): SpeechSynthesisVoice | null {
  const langCode = getLanguageCode(language);
  
  console.log(`🔍 Finding voice for ${language} (${langCode}) from ${voices.length} voices`);
  
  // Try exact match first
  let voice = voices.find(v => v.lang === langCode);
  if (voice) {
    console.log(`✅ Found exact match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // Try language prefix match
  voice = voices.find(v => v.lang.startsWith(language));
  if (voice) {
    console.log(`✅ Found prefix match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // Try broader language family
  const baseLang = language.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(baseLang));
  if (voice) {
    console.log(`✅ Found family match: ${voice.name} (${voice.lang})`);
    return voice;
  }

  // Fallback to English ONLY for English text
  if (language === 'en') {
    voice = voices.find(v => v.lang.startsWith('en'));
    if (voice) {
      console.log(`✅ Found English fallback: ${voice.name} (${voice.lang})`);
      return voice;
    }
  }

  // Last resort - first available voice (but don't use for non-English)
  if (language === 'en' && voices.length > 0) {
    console.log(`⚠️ Using first available voice: ${voices[0].name} (${voices[0].lang})`);
    return voices[0];
  }

  console.warn(`❌ No appropriate voice found for ${language}`);
  return null;
}

/**
 * Create optimized utterance for a language
 */
export function createUtterance(text: string, language: Language): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Language-specific optimizations
  const settings = {
    en: { rate: 1.0, pitch: 1.0, volume: 1.0 },
    hi: { rate: 0.85, pitch: 1.0, volume: 1.0 },
    ta: { rate: 0.9, pitch: 1.0, volume: 1.0 },
    te: { rate: 0.9, pitch: 1.0, volume: 1.0 }
  };
  
  const setting = settings[language];
  utterance.rate = setting.rate;
  utterance.pitch = setting.pitch;
  utterance.volume = setting.volume;
  
  return utterance;
}

/**
 * Browser TTS implementation
 */
export async function speakWithBrowserTTS(text: string, language: Language): Promise<TTSDebugInfo> {
  const startTime = Date.now();
  
  try {
    console.log(`🎤 Starting Browser TTS for ${language}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    // Load voices
    const voices = await loadVoices();
    
    // Find best voice
    const selectedVoice = findBestVoice(voices, language);
    
    if (!selectedVoice) {
      throw new Error(`No voice available for language: ${language}`);
    }
    
    // Create utterance
    const utterance = createUtterance(text, language);
    utterance.lang = selectedVoice.lang;
    utterance.voice = selectedVoice;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Setup event handlers
    return new Promise<TTSDebugInfo>((resolve) => {
      utterance.onstart = () => {
        console.log(`🎤 Browser TTS started: ${language.toUpperCase()} with ${selectedVoice.name}`);
      };
      
      utterance.onend = () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const debug: TTSDebugInfo = {
          detectedLanguage: language,
          availableVoices: voices.length,
          selectedVoice: selectedVoice.name,
          textLength: text.length,
          langCode: selectedVoice.lang,
          success: true,
          ttsMethod: 'browser'
        };
        
        console.log(`🔇 Browser TTS finished ${language.toUpperCase()} in ${duration}ms`);
        console.log(`📊 Browser TTS Debug:`, debug);
        
        resolve(debug);
      };
      
      utterance.onerror = (event) => {
        const debug: TTSDebugInfo = {
          detectedLanguage: language,
          availableVoices: voices.length,
          selectedVoice: selectedVoice.name,
          textLength: text.length,
          langCode: selectedVoice.lang,
          success: false,
          ttsMethod: 'browser'
        };
        
        console.error(`❌ Browser TTS Error for ${language}:`, event);
        console.log(`📊 Browser TTS Debug:`, debug);
        
        resolve(debug);
      };
      
      // Start speaking
      window.speechSynthesis.speak(utterance);
    });
    
  } catch (error) {
    const debug: TTSDebugInfo = {
      detectedLanguage: language,
      availableVoices: 0,
      selectedVoice: 'none',
      textLength: text.length,
      langCode: getLanguageCode(language),
      success: false,
      ttsMethod: 'browser'
    };
    
    console.error(`❌ Browser TTS System Error for ${language}:`, error);
    console.log(`📊 Browser TTS Debug:`, debug);
    
    return debug;
  }
}

/**
 * Cloud TTS implementation using Google Translate TTS
 */
export async function speakWithCloudTTS(text: string, language: Language): Promise<TTSDebugInfo> {
  const startTime = Date.now();
  
  try {
    console.log(`☁️ Starting Cloud TTS for ${language}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    const cloudLang = CLOUD_LANGUAGE_CODES[language];
    if (!cloudLang) {
      throw new Error(`Cloud TTS not supported for language: ${language}`);
    }
    
    // Create audio URL for Google Translate TTS
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=${cloudLang}`;
    
    // Create and play audio
    const audio = new Audio(audioUrl);
    
    return new Promise<TTSDebugInfo>((resolve) => {
      audio.onplay = () => {
        console.log(`☁️ Cloud TTS started: ${language.toUpperCase()}`);
      };
      
      audio.onended = () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const debug: TTSDebugInfo = {
          detectedLanguage: language,
          availableVoices: 0,
          selectedVoice: `Google Cloud TTS (${cloudLang})`,
          textLength: text.length,
          langCode: cloudLang,
          success: true,
          ttsMethod: 'cloud'
        };
        
        console.log(`☁️ Cloud TTS finished ${language.toUpperCase()} in ${duration}ms`);
        console.log(`📊 Cloud TTS Debug:`, debug);
        
        resolve(debug);
      };
      
      audio.onerror = (event) => {
        const debug: TTSDebugInfo = {
          detectedLanguage: language,
          availableVoices: 0,
          selectedVoice: `Google Cloud TTS (${cloudLang})`,
          textLength: text.length,
          langCode: cloudLang,
          success: false,
          ttsMethod: 'cloud'
        };
        
        console.error(`❌ Cloud TTS Error for ${language}:`, event);
        console.log(`📊 Cloud TTS Debug:`, debug);
        
        resolve(debug);
      };
      
      // Start playing
      audio.play().catch((error) => {
        console.error(`❌ Cloud TTS Play Error for ${language}:`, error);
        resolve({
          detectedLanguage: language,
          availableVoices: 0,
          selectedVoice: `Google Cloud TTS (${cloudLang})`,
          textLength: text.length,
          langCode: cloudLang,
          success: false,
          ttsMethod: 'cloud'
        });
      });
    });
    
  } catch (error) {
    const debug: TTSDebugInfo = {
      detectedLanguage: language,
      availableVoices: 0,
      selectedVoice: 'none',
      textLength: text.length,
      langCode: CLOUD_LANGUAGE_CODES[language] || 'unknown',
      success: false,
      ttsMethod: 'cloud'
    };
    
    console.error(`❌ Cloud TTS System Error for ${language}:`, error);
    console.log(`📊 Cloud TTS Debug:`, debug);
    
    return debug;
  }
}

/**
 * Main robust TTS function with intelligent fallback
 */
export async function speakResponse(text: string, debugInfo?: Partial<TTSDebugInfo>): Promise<TTSDebugInfo> {
  const startTime = Date.now();
  
  try {
    console.log(`🎤 Starting Robust TTS for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    
    // Validate input
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input');
    }

    // Detect language
    const detectedLanguage = detectLanguage(text);
    
    // Load voices
    const voices = await loadVoices();
    
    // Check if appropriate voice exists
    const hasVoice = hasVoiceForLanguage(voices, detectedLanguage);
    
    let debug: TTSDebugInfo;
    
    if (hasVoice) {
      console.log(`✅ Using Browser TTS for ${detectedLanguage}`);
      debug = await speakWithBrowserTTS(text, detectedLanguage);
    } else {
      console.log(`⚠️ No local voice for ${detectedLanguage}, switching to Cloud TTS`);
      debug = await speakWithCloudTTS(text, detectedLanguage);
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`🎯 Robust TTS completed in ${totalTime}ms using ${debug.ttsMethod} TTS`);
    
    return debug;
    
  } catch (error) {
    const debug: TTSDebugInfo = {
      detectedLanguage: 'en',
      availableVoices: 0,
      selectedVoice: 'none',
      textLength: text.length,
      langCode: 'en-US',
      success: false,
      ttsMethod: 'failed'
    };
    
    console.error('❌ Robust TTS System Error:', error);
    console.log(`📊 Robust TTS Debug:`, debug);
    
    return debug;
  }
}

/**
 * Quick speak function for immediate use
 */
export async function speakText(text: string): Promise<void> {
  if (!text || !text.trim()) return;
  
  try {
    const debug = await speakResponse(text);
    if (!debug.success) {
      console.warn('⚠️ TTS failed, but continuing...');
    }
  } catch (error) {
    console.error('❌ Quick speak failed:', error);
  }
}

/**
 * Initialize TTS system
 */
export async function initializeTTS(): Promise<boolean> {
  try {
    const voices = await loadVoices();
    console.log(`✅ Robust TTS initialized with ${voices.length} voices`);
    
    // Check which languages have local voices
    const languages: Language[] = ['en', 'hi', 'ta', 'te'];
    const languageSupport = languages.map(lang => ({
      language: lang,
      hasVoice: hasVoiceForLanguage(voices, lang)
    }));
    
    console.log('🎯 Language support:', languageSupport);
    
    return true;
  } catch (error) {
    console.error('❌ Robust TTS initialization failed:', error);
    return false;
  }
}
