import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set. Please create a .env file with your API key.");
}

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

  console.log("🤖 Generating content with:")
  console.log("  - User message:", userMessage)
  console.log("  - Conversation history length:", conversationHistory.length)
  console.log("  - System context:", systemContext ? `Yes (${systemContext.length} chars)` : "No")
  if (systemContext) {
    console.log("  - System context preview:", systemContext.substring(0, 200) + "...")
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-lite",
    systemInstruction: systemContext
  });

  const history = conversationHistory.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.parts }]
  }));

  console.log("  - History formatted:", history.length, "messages")

  const chat = history.length > 0 
    ? model.startChat({ history })
    : model.startChat();

  console.log("  - Sending message to Gemini...")
  
  try {
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    const text = response.text();
    
    console.log("✅ Response received:", text.substring(0, 100) + "...")
    return text;
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("Resource exhausted")) {
      const retryAfter = error?.retryDelay || 10;
      throw new Error(`Rate limit exceeded. Please wait ${retryAfter} seconds before trying again.`);
    }
    throw error;
  }
};

