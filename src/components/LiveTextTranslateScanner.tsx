import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Volume2, RotateCcw, AlertCircle } from 'lucide-react';

interface DetectionResult {
  detectedText: string;
  translatedText: string;
  timestamp: number;
}

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
];

const LiveTextTranslateScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('ta');
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ocrIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDetectionRef = useRef<string>('');

  // Load Tesseract.js dynamically
  const [Tesseract, setTesseract] = useState<any>(null);

  useEffect(() => {
    const loadTesseract = async () => {
      try {
        const TesseractModule = await import('tesseract.js');
        setTesseract(TesseractModule.default || TesseractModule);
      } catch (err) {
        console.error('Failed to load Tesseract.js:', err);
        setError('Failed to load OCR engine. Please refresh the page.');
      }
    };
    
    loadTesseract();
  }, []);

  // Voice loading utility
  const loadVoices = useCallback(async (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          resolve(speechSynthesis.getVoices());
        };
      }
    });
  }, []);

  // Text-to-speech function
  const speakText = useCallback(async (text: string, lang: string) => {
    if (!text.trim()) return;

    try {
      setIsSpeaking(true);
      
      const voices = await loadVoices();
      const voice = voices.find(v => v.lang.toLowerCase().startsWith(lang));

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang;
      }

      // Language-specific optimizations
      if (lang === 'hi') {
        utterance.rate = 0.85;
      } else if (lang === 'ta' || lang === 'te') {
        utterance.rate = 0.9;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setError('Failed to speak text. Please try again.');
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (err) {
      setIsSpeaking(false);
      setError('Text-to-speech failed. Please try again.');
    }
  }, [loadVoices]);

  // Translation function
  const translateText = useCallback(async (text: string, targetLang: string): Promise<string> => {
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (err) {
      console.error('Translation error:', err);
      throw new Error('Translation service unavailable');
    }
  }, []);

  // OCR processing
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !Tesseract || isProcessing) return;

    try {
      setIsProcessing(true);
      setOcrProgress('Processing frame...');

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size for optimal OCR performance
      canvas.width = 640;
      canvas.height = 480;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Perform OCR with multilingual support
      const result = await Tesseract.recognize(
        canvas,
        'eng+tam+hin+tel',
        {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(`Recognizing text... ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      const detectedText = result.data.text.trim();

      // Ignore empty or duplicate results
      if (!detectedText || detectedText === lastDetectionRef.current) {
        setIsProcessing(false);
        setOcrProgress('');
        return;
      }

      lastDetectionRef.current = detectedText;

      // Translate the detected text
      let translatedText = detectedText;
      try {
        translatedText = await translateText(detectedText, targetLanguage);
      } catch (err) {
        console.warn('Translation failed, using original text:', err);
      }

      // Update detection result
      setDetection({
        detectedText,
        translatedText,
        timestamp: Date.now()
      });

      setOcrProgress('');
      setIsProcessing(false);

    } catch (err) {
      console.error('OCR error:', err);
      setError('OCR processing failed. Please try again.');
      setIsProcessing(false);
      setOcrProgress('');
    }
  }, [Tesseract, isProcessing, targetLanguage, translateText]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setDetection(null);
      lastDetectionRef.current = '';

      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsScanning(true);

      // Start OCR interval (every 1500ms)
      ocrIntervalRef.current = setInterval(() => {
        processFrame();
      }, 1500);

    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please ensure your device has a camera.');
      } else {
        setError('Failed to start camera. Please try again.');
      }
    }
  }, [processFrame]);

  // Stop camera
  const stopCamera = useCallback(() => {
    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Stop OCR interval
    if (ocrIntervalRef.current) {
      clearInterval(ocrIntervalRef.current);
      ocrIntervalRef.current = null;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();

    setIsScanning(false);
    setIsProcessing(false);
    setOcrProgress('');
    setIsSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Text Translator</h2>
        <p className="text-gray-600">Point your camera at text to see real-time translation</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Camera Controls */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        {!isScanning ? (
          <button
            onClick={startCamera}
            disabled={!Tesseract}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Camera className="w-4 h-4" />
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <CameraOff className="w-4 h-4" />
            Stop Camera
          </button>
        )}

        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Translate to:</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="relative mb-6 bg-black rounded-lg overflow-hidden" style={{ maxHeight: '480px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
          style={{ display: isScanning ? 'block' : 'none' }}
        />
        
        {!isScanning && (
          <div className="flex items-center justify-center h-96 text-gray-400">
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Click "Start Camera" to begin scanning</p>
            </div>
          </div>
        )}

        {/* OCR Progress Overlay */}
        {isProcessing && (
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
            <p className="text-sm">{ocrProgress}</p>
          </div>
        )}
      </div>

      {/* Hidden canvas for OCR processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Detection Results */}
      {detection && (
        <div className="space-y-4">
          {/* Detected Text */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Detected Text</h3>
            <p className="text-gray-900 text-lg">{detection.detectedText}</p>
          </div>

          {/* Translated Text */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">
              Translated Text ({LANGUAGES.find(l => l.code === targetLanguage)?.name})
            </h3>
            <p className="text-blue-900 text-lg">{detection.translatedText}</p>
          </div>

          {/* Speak Button */}
          <button
            onClick={() => speakText(detection.translatedText, targetLanguage)}
            disabled={isSpeaking || !detection.translatedText.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Volume2 className="w-5 h-5" />
            {isSpeaking ? 'Speaking...' : 'Speak Translation'}
          </button>
        </div>
      )}

      {/* Instructions */}
      {!detection && isScanning && (
        <div className="text-center py-8 text-gray-500">
          <RotateCcw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Point your camera at text to detect and translate</p>
          <p className="text-sm mt-2">OCR processes frames every 1.5 seconds</p>
        </div>
      )}
    </div>
  );
};

export default LiveTextTranslateScanner;
