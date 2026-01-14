export type ParsedAIResponse = {
  text: string
  careerSlugs: string[]
}

/**
 * Removes JSON objects from text that might appear inline
 */
function removeInlineJson(text: string): string {
  // Remove JSON blocks with ```json or ``` markers
  let cleaned = text.replace(/```json\s*[\s\S]*?\s*```/g, "")
  cleaned = cleaned.replace(/```\s*\{[\s\S]*?\}\s*```/g, "")
  
  // Remove inline JSON objects that might appear in the text
  // Match JSON objects that contain "careers" key
  cleaned = cleaned.replace(/\{[\s\S]*?"careers"[\s\S]*?\}/g, "")
  
  // Remove any remaining JSON-like structures that might be in the text
  // This catches cases where JSON appears without proper formatting
  cleaned = cleaned.replace(/\{\s*"careers"\s*:\s*\[[\s\S]*?\]\s*\}/g, "")
  
  // Clean up any leftover JSON artifacts
  cleaned = cleaned.replace(/^\s*\{[\s\S]*?\}\s*$/gm, "")
  
  // Remove multiple consecutive newlines and trim
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n").trim()
  
  return cleaned
}

/**
 * Extracts career slugs from JSON in various formats
 */
function extractCareerSlugs(response: string): string[] {
  const slugs: string[] = []
  
  // Try to find JSON in code blocks first
  const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1].trim())
      if (Array.isArray(parsed.careers)) {
        parsed.careers.forEach((c: any) => {
          const slug = c.slug || c.id
          if (slug) slugs.push(slug)
        })
      }
      return slugs
    } catch (error) {
      // Continue to try other methods
    }
  }
  
  // Try to find inline JSON
  const inlineJsonMatch = response.match(/\{[\s\S]*?"careers"[\s\S]*?\}/)
  if (inlineJsonMatch) {
    try {
      const parsed = JSON.parse(inlineJsonMatch[0])
      if (Array.isArray(parsed.careers)) {
        parsed.careers.forEach((c: any) => {
          const slug = c.slug || c.id
          if (slug) slugs.push(slug)
        })
      }
      return slugs
    } catch (error) {
      // Continue
    }
  }
  
  return slugs
}

export function parseAIResponse(response: string): ParsedAIResponse {
  // First, extract career slugs from any JSON that might be present
  const careerSlugs = extractCareerSlugs(response)
  
  // Then, clean the text to remove all JSON artifacts
  let cleanedText = removeInlineJson(response)
  
  // If after cleaning we have no text but we had a response, 
  // it means the response was mostly JSON - return a fallback message
  if (!cleanedText.trim() && response.trim()) {
    cleanedText = response
      .replace(/```json\s*[\s\S]*?\s*```/g, "")
      .replace(/```\s*[\s\S]*?\s*```/g, "")
      .replace(/\{[\s\S]*?\}/g, "")
      .trim()
    
    // If still empty, provide a default message
    if (!cleanedText.trim()) {
      cleanedText = "I found some careers that might interest you. Please check the career cards below."
    }
  }
  
  return {
    text: cleanedText,
    careerSlugs
  }
}
