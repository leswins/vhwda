import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export type ChatMessage = {
  role: "user" | "model"
  parts: string
}

export const generateContent = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  systemContext?: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-lite",
    systemInstruction: systemContext
  });

  const history = conversationHistory.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.parts }]
  }));

  const chat = history.length > 0 
    ? model.startChat({ history })
    : model.startChat();
  
  try {
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("Resource exhausted")) {
      const retryAfter = error?.retryDelay || 10;
      throw new Error(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`);
    }
    throw error;
  }
};

