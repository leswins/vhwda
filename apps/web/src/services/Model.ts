import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set. Please create a .env file with your API key.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export const generateContent = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
  return text;
};

