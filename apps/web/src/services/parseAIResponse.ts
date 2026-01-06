export type ParsedAIResponse = {
  text: string
  careerSlugs: string[]
}

export function parseAIResponse(response: string): ParsedAIResponse {
  const jsonBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
  
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1].trim())
      const text = response.replace(/```json\s*[\s\S]*?\s*```/g, "").trim()
      
      const slugs = Array.isArray(parsed.careers) 
        ? parsed.careers.map((c: any) => c.slug || c.id).filter(Boolean)
        : []
      
      return {
        text: text || response,
        careerSlugs: slugs
      }
    } catch (error) {
      return {
        text: response,
        careerSlugs: []
      }
    }
  }

  const jsonCodeBlockMatch = response.match(/```\s*([\s\S]*?)\s*```/)
  if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
    try {
      const parsed = JSON.parse(jsonCodeBlockMatch[1].trim())
      const text = response.replace(/```\s*[\s\S]*?\s*```/g, "").trim()
      
      const slugs = Array.isArray(parsed.careers) 
        ? parsed.careers.map((c: any) => c.slug || c.id).filter(Boolean)
        : []
      
      return {
        text: text || response,
        careerSlugs: slugs
      }
    } catch (error) {
      return {
        text: response,
        careerSlugs: []
      }
    }
  }

  const inlineJsonMatch = response.match(/\{[\s\S]*"careers"[\s\S]*\}/)
  if (inlineJsonMatch) {
    try {
      const parsed = JSON.parse(inlineJsonMatch[0])
      const text = response.replace(inlineJsonMatch[0], "").trim()
      
      const slugs = Array.isArray(parsed.careers) 
        ? parsed.careers.map((c: any) => c.slug || c.id).filter(Boolean)
        : []
      
      return {
        text: text || response,
        careerSlugs: slugs
      }
    } catch (error) {
      return {
        text: response,
        careerSlugs: []
      }
    }
  }

  return {
    text: response,
    careerSlugs: []
  }
}
