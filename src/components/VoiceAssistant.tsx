import { useState, useRef, useEffect } from "react";
import { Mic, Send, Volume2, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

// Extend Window interface for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const DEMO_PROMPTS = [
  "How can I save money?",
  "What government schemes can help me?",
  "Is it safe to take a loan?",
  "How to start a small business?",
  "मुझे बचत कैसे करनी चाहिए?",
  "मैं कौन सी योजना के लिए पात्र हूँ?",
];

export const VoiceAssistant = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      text: "नमस्ते! मैं आपकी सखी हूँ। मुझसे कोई भी वित्तीय सवाल पूछें।",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.language = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "en-IN";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(
          "माइक्रोफोन से समस्या हुई। कृपया दोबारा कोशिश करें।"
        );
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };
    }

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    };
  }, [language]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMicrophone = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      // Send to Gemini API
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: data.reply || "कृपया दोबारा कोशिश करें।",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Text-to-speech
      speakText(assistantMessage.text);
    } catch (err) {
      console.error("Error:", err);
      setError("एक त्रुटि हुई। कृपया दोबारा कोशिश करें।");

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        text: "माफ कीजिए, मुझे कुछ समस्या आ रही है। कृपया बाद में दोबारा कोशिश करें।",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleDemoPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute bottom-0 right-0 w-96 max-w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col h-[600px]"
        >
          {/* Header */}
          <div className="bg-saffron-gradient text-saffron-foreground p-4 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">IRAIVI</h3>
                <p className="text-xs opacity-90">Your Financial Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-75 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.type === "user"
                      ? "bg-saffron-gradient text-saffron-foreground rounded-br-none"
                      : "bg-white dark:bg-slate-700 text-foreground border border-border rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-saffron-gradient animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-saffron-gradient animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-saffron-gradient animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {messages.length <= 1 && !isLoading && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  या डेमो प्रश्न आजमाएं:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {DEMO_PROMPTS.slice(0, 3).map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleDemoPrompt(prompt)}
                      className="text-xs bg-saffron-gradient/10 text-saffron-deep hover:bg-saffron-gradient/20 px-3 py-1 rounded-full transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-white dark:bg-slate-900 rounded-b-3xl space-y-2">
            {isListening && (
              <div className="text-center text-xs text-saffron-deep animate-pulse">
                🎤 सुन रहा हूँ...
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage();
                  }
                }}
                placeholder="अपना सवाल लिखें..."
                className="rounded-full"
                disabled={isLoading || isListening}
              />
              <button
                onClick={handleMicrophone}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isListening
                    ? "bg-red-500 text-white"
                    : "bg-saffron-gradient text-saffron-foreground hover:opacity-90"
                }`}
                title="Press to speak"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:opacity-90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen
            ? "bg-red-500 text-white"
            : "bg-saffron-gradient text-saffron-foreground hover:shadow-xl"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default VoiceAssistant;
