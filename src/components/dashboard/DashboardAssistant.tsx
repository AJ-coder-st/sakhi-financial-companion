import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Send, MicOff, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/i18n/LanguageContext";
import { speakResponse, initializeTTS, type DetectedLanguage } from "@/utils/robust-tts";
import LiveTextTranslateScanner from "../LiveTextTranslateScanner";

type Message = { role: "user" | "assistant"; content: string };

const initialMessages: Message[] = [
  { role: "assistant", content: "नमस्ते सुनीता दीदी! 🙏 मैं आपकी इराइवी हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?\n\nHello Sunita Didi! I'm your IRAIVI. How can I help you today?" },
];

const DashboardAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null as any);
  const audioChunksRef = useRef<Blob[]>([]);
  const { t, language } = useLanguage();
  const env = (import.meta as any).env || {};
  const API_BASE: string =
    env.VITE_API_BASE_URL || (env.DEV ? "http://localhost:3001" : "");

  // Initialize robust TTS system
  useEffect(() => {
    initializeTTS().then((ready) => {
      setTtsReady(ready);
      console.log(`✅ Robust TTS system ${ready ? 'ready' : 'failed'}`);
    });
  }, []);

  const speak = async (text: string, detectedLanguage?: DetectedLanguage) => {
    if (!ttsReady) {
      console.warn('⚠️ TTS system not ready yet');
      return;
    }
    
    if (!text || !text.trim()) return;
    
    console.log(`🎤 Speaking text with robust TTS:`, text.substring(0, 50) + (text.length > 50 ? '...' : ''));
    
    try {
      const debug = await speakResponse(text);
      if (!debug.success) {
        console.warn('⚠️ TTS completed with issues:', debug);
      }
    } catch (error) {
      console.error('❌ TTS failed:', error);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const content = (overrideText ?? input).trim();
    if (!content) return;

    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/advisor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: content,
          // TODO: wire real user profile here
          income: 0,
          expenses: 0,
          occupation: "",
          location: "",
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        const msg =
          (error as any)?.error ||
          "सर्वर से जवाब नहीं आ पाया। थोड़ी देर बाद दोबारा कोशिश करें.\n\nThe server could not answer right now. Please try again in some time.";
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      const data = (await res.json()) as {
        explanation?: string;
        recommendation?: string | null;
        loanLimit?: number | null;
        safeEMI?: number;
        yearlySavings?: number;
        financialHealthScore?: number;
        riskLevel?: string;
        detectedLanguage?: DetectedLanguage;
      };

      // Use the single-language explanation from AI
      const explanation =
        data.explanation ||
        "मैंने आपका सवाल समझा, लेकिन फिलहाल विस्तृत जवाब नहीं दे पाई।\n\nI understood your question but could not give a detailed answer right now.";

      // Create message with only the AI explanation (no bilingual summaries)
      const assistantMsg: Message = { role: "assistant", content: explanation };
      setMessages((prev) => [...prev, assistantMsg]);
      
      // Speak using the detected language
      speak(explanation, data.detectedLanguage);
    } catch (err) {
      console.error("Advisor call failed", err);
      const msg =
        "कनेक्शन में दिक्कत आ रही है। कृपया अपना इंटरनेट या नेटवर्क जांचें और दोबारा कोशिश करें।\n\nThere seems to be a connection problem. Please check your internet and try again.";
      const assistantMsg: Message = { role: "assistant", content: msg };
      setMessages((prev) => [...prev, assistantMsg]);
      speak(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const transcribeAndSend = async (blob: Blob) => {
    try {
      setIsLoading(true);

      // Enhanced audio validation
      if (!blob || blob.size === 0) {
        const msg =
          "आवाज़ रिकॉर्ड नहीं हो पाई। कृपया दोबारा बोलने की कोशिश करें।\n\nCould not capture your voice. Please try speaking again.";
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      // Check minimum audio duration (at least 0.5 seconds)
      if (blob.size < 1000) {
        const msg =
          "रिकॉर्डिंग बहुत छोटी है। कृपया कम से कम 1 सेकंड तक बोलें।\n\nRecording is too short. Please speak for at least 1 second.";
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      // Check maximum audio size (25MB limit for AssemblyAI)
      if (blob.size > 25 * 1024 * 1024) {
        const msg =
          "रिकॉर्डिंग बहुत लंबी है। कृपया 30 सेकंड से कम बोलें।\n\nRecording is too long. Please speak for less than 30 seconds.";
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      console.log(`Processing audio blob: ${blob.size} bytes, type: ${blob.type}`);

      // Convert to base64 with enhanced error handling
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (!result || !result.includes(",")) {
            reject(new Error("Invalid audio data format"));
            return;
          }
          const [, b64] = result.split(",");
          if (!b64) {
            reject(new Error("Empty base64 data"));
            return;
          }
          resolve(b64);
        };
        reader.onerror = () => reject(new Error("Failed to read audio file"));
        reader.readAsDataURL(blob);
      }).catch((error) => {
        console.error("Audio conversion error:", error);
        throw error;
      });

      if (!base64) {
        const msg =
          "आवाज़ रिकॉर्ड नहीं हो पाई। कृपया दोबारा बोलने की कोशिश करें।\n\nCould not capture your voice. Please try speaking again.";
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      // Send to backend with improved error handling
      const res = await fetch(`${API_BASE}/api/stt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: blob.type || "audio/webm",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || "Speech-to-text service error";
        console.error("STT API error:", res.status, errorMsg);
        
        const msg =
          `आपकी आवाज़ समझने में दिक्कत हुई। ${errorMsg}\n\nThere was a problem understanding your voice. ${errorMsg}`;
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!data.success || !data.text) {
        const errorMsg = data.error || "Could not transcribe audio";
        console.error("STT transcription failed:", errorMsg);
        
        const msg =
          `आपकी आवाज़ समझने में दिक्कत हुई। ${errorMsg}\n\nThere was a problem understanding your voice. ${errorMsg}`;
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      const transcript = data.text as string;
      
      // Validate transcript quality
      if (!transcript.trim()) {
        const msg =
          "कोई आवाज़ नहीं पहचानी गई। कृपया साफ़ बोलकर दोबारा कोशिश करें।\n\nNo speech detected. Please speak clearly and try again.";
        const assistantMsg: Message = { role: "assistant", content: msg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(msg);
        return;
      }

      // Log transcription details for debugging
      console.log("Transcription successful:", {
        text: transcript,
        confidence: data.confidence,
        words: data.words,
        duration: blob.size
      });

      setInput(transcript);
      await handleSend(transcript);
    } catch (error) {
      console.error("STT failed:", error);
      
      let errorMsg = "वॉयस सर्विस से कनेक्शन नहीं हो पाया। कृपया अपना इंटरनेट चेक करें या टाइप करके सवाल पूछें।\n\nCould not connect to the voice service. Please check your internet or type your question.";
      
      if (error instanceof Error) {
        if (error.message.includes("NotAllowedError")) {
          errorMsg = "माइक्रोफ़ोन की अनुमति नहीं दी गई। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।\n\nMicrophone permission denied. Please allow microphone access in your browser settings.";
        } else if (error.message.includes("NotFoundError")) {
          errorMsg = "कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक्रोफ़ोन कनेक्ट करें।\n\nNo microphone found. Please connect a microphone.";
        } else if (error.message.includes("NotReadableError")) {
          errorMsg = "माइक्रोफ़ोन उपयोग में है। कृपया कुछ देर बाद फिर से कोशिश करें।\n\nMicrophone is in use. Please try again in a moment.";
        }
      }
      
      const assistantMsg: Message = { role: "assistant", content: errorMsg };
      setMessages((prev) => [...prev, assistantMsg]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (typeof window === "undefined") return;

    if (isListening) {
      try {
        mediaRecorderRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }

    // Enhanced microphone capability check
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg =
        "आपके डिवाइस पर माइक्रोफोन एक्सेस उपलब्ध नहीं है। कृपया टाइप करके सवाल पूछें।\n\nMicrophone access is not available on your device. Please type your question instead.";
      const assistantMsg: Message = { role: "assistant", content: msg };
      setMessages((prev) => [...prev, assistantMsg]);
      speak(msg);
      return;
    }

    // Enhanced audio constraints for better quality
    const audioConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000, // 16kHz is optimal for speech recognition
        channelCount: 1, // Mono is sufficient for speech
      },
    };

    navigator.mediaDevices
      .getUserMedia(audioConstraints)
      .then((stream) => {
        console.log("Microphone access granted, stream active:", stream.active);
        
        // Check if we got audio tracks
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
          throw new Error("No audio tracks found in media stream");
        }

        // Use WebM format which is widely supported
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg';

        console.log("Using MIME type:", mimeType);

        const recorder = new MediaRecorder(stream, { mimeType });
        audioChunksRef.current = [];

        // Enhanced data handling
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            console.log(`Audio chunk received: ${event.data.size} bytes`);
          }
        };

        recorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          const msg =
            "रिकॉर्डिंग में त्रुटि हुई। कृपया फिर से कोशिश करें।\n\nRecording error occurred. Please try again.";
          const assistantMsg: Message = { role: "assistant", content: msg };
          setMessages((prev) => [...prev, assistantMsg]);
          speak(msg);
          setIsListening(false);
        };

        recorder.onstop = () => {
          console.log("MediaRecorder stopped, processing audio...");
          
          // Combine all audio chunks
          if (audioChunksRef.current.length === 0) {
            const msg =
              "आवाज़ रिकॉर्ड नहीं हो पाई। कृपया दोबारा बोलने की कोशिश करें।\n\nCould not capture your voice. Please try speaking again.";
            const assistantMsg: Message = { role: "assistant", content: msg };
            setMessages((prev) => [...prev, assistantMsg]);
            speak(msg);
            setIsListening(false);
            return;
          }

          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          audioChunksRef.current = [];
          
          // Clean up stream
          stream.getTracks().forEach((track) => {
            track.stop();
            console.log("Audio track stopped:", track.kind, track.label);
          });

          console.log(`Final audio blob: ${blob.size} bytes, type: ${blob.type}`);
          void transcribeAndSend(blob);
        };

        mediaRecorderRef.current = recorder;
        
        // Start recording with time limit (30 seconds max)
        recorder.start(1000); // Collect data every second
        setIsListening(true);
        
        // Auto-stop after 30 seconds to prevent very long recordings
        setTimeout(() => {
          if (recorder.state === 'recording') {
            console.log("Auto-stopping recording after 30 seconds");
            recorder.stop();
            setIsListening(false);
          }
        }, 30000);

      })
      .catch((err) => {
        console.error("Microphone access error:", err);
        setIsListening(false);
        
        let errorMsg = "माइक्रोफ़ोन एक्सेस में त्रुटि। कृपया टाइप करके सवाल पूछें।\n\nMicrophone access error. Please type your question instead.";
        
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
            errorMsg = "माइक्रोफ़ोन की अनुमति नहीं दी गई। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।\n\nMicrophone permission denied. Please allow microphone access in your browser settings.";
          } else if (err.name === 'NotFoundError' || err.message.includes('No device')) {
            errorMsg = "कोई माइक्रोफ़ोन नहीं मिला। कृपया माइक्रोफ़ोन कनेक्ट करें।\n\nNo microphone found. Please connect a microphone.";
          } else if (err.name === 'NotReadableError' || err.message.includes('in use')) {
            errorMsg = "माइक्रोफ़ोन उपयोग में है। कृपया कुछ देर बाद फिर से कोशिश करें।\n\nMicrophone is in use. Please try again in a moment.";
          } else if (err.name === 'NotSupportedError') {
            errorMsg = "आपका ब्राउज़र माइक्रोफ़ोन एक्सेस का समर्थन नहीं करता। कृपया आधुनिक ब्राउज़र का उपयोग करें।\n\nYour browser doesn't support microphone access. Please use a modern browser.";
          }
        }
        
        const assistantMsg: Message = { role: "assistant", content: errorMsg };
        setMessages((prev) => [...prev, assistantMsg]);
        speak(errorMsg);
      });
  };

  const startRecording = () => toggleListening();
  const stopRecording = () => toggleListening();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Scanner Toggle */}
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {showScanner ? "Live Text Translator" : "SAKHI Assistant"}
        </h2>
        <Button
          onClick={() => setShowScanner(!showScanner)}
          variant={showScanner ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {showScanner ? (
            <>
              <Mic className="w-4 h-4" />
              Chat Assistant
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              Live Scanner
            </>
          )}
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {showScanner ? (
          <div className="h-full overflow-y-auto">
            <LiveTextTranslateScanner />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted text-muted-foreground p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={() => (isListening ? stopRecording() : startRecording())}
                  className="rounded-xl"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <div className="flex-1 flex bg-muted rounded-xl px-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                    placeholder={t("typeOrSpeak")}
                    className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSend()}
                    className="m-1 rounded-xl bg-primary"
                    disabled={!input.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAssistant;
