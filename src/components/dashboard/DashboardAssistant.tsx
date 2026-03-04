import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Send, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

type Message = { role: "user" | "assistant"; content: string };

const initialMessages: Message[] = [
  { role: "assistant", content: "नमस्ते सुनीता दीदी! 🙏 मैं आपकी सखी हूँ। आज मैं आपकी क्या मदद कर सकती हूँ?\n\nHello Sunita Didi! I'm your SAKHI. How can I help you today?" },
];

const DashboardAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { t } = useLanguage();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "बहुत अच्छा सवाल! 😊 आपके प्रोफाइल के हिसाब से, मैंने 3 योजनाएं ढूंढी हैं जो आपके लिए सबसे अच्छी हैं। क्या मैं आपको इनके बारे में बताऊँ?\n\nGreat question! Based on your profile, I found 3 schemes best suited for you. Shall I tell you about them?",
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-auto space-y-4 pb-4">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-saffron/20 rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
              <p className="text-sm whitespace-pre-line">{m.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border pt-4 flex gap-3 items-end">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsListening(!isListening)}
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isListening ? "bg-destructive" : "bg-saffron-gradient"} shadow-lg`}
        >
          {isListening ? <MicOff className="w-6 h-6 text-destructive-foreground" /> : <Mic className="w-6 h-6 text-saffron-foreground" />}
        </motion.button>
        <div className="flex-1 flex bg-muted rounded-2xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeOrSpeak")}
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
          />
          <Button size="sm" onClick={handleSend} className="m-1 rounded-xl bg-primary" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAssistant;
