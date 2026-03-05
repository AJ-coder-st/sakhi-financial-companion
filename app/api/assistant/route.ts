import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are IRAIVI, a friendly financial assistant helping rural women in India understand savings, loans, and government schemes. 
    
    Guidelines:
    • Use simple, easy-to-understand language
    • Provide practical, actionable advice
    • Focus on micro-savings and small steps
    • Mention relevant Indian government schemes when applicable
    • Be encouraging and supportive
    • Keep responses concise (2-3 sentences max for quick reply)
    • Use rupees (₹) for currency
    • Be culturally sensitive and respectful`;

    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
      history: [],
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser: ${message}`);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      {
        error: "Failed to generate response",
        reply: "क्षमा करें, मुझे कुछ समस्या आ रही है। कृपया बाद में दोबारा कोशिश करें।",
      },
      { status: 500 }
    );
  }
};
