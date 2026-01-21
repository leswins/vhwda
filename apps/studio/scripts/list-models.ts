import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai"

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is required")
    process.exit(1)
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  
  // The SDK doesn't have a direct listModels method on the genAI instance in some versions, 
  // but we can try fetching from the raw endpoint or use the known working names.
  console.log("Checking available models via fetch...")
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    )
    const data = await response.json()
    
    if (data.error) {
      console.error("❌ API Error:", data.error)
      return
    }

    console.log("\nAvailable Models:")
    data.models?.forEach((m: any) => {
      console.log(`- ${m.name.replace('models/', '')} (Supported: ${m.supportedGenerationMethods.join(', ')})`)
    })
  } catch (err) {
    console.error("❌ Fetch failed:", err)
  }
}

listModels()

