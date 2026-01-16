import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { z } from 'zod';
import path from 'path';

const CareerPromptSchema = z.object({
  career: z.string().min(1, 'Career name is required'),
  sora_prompt: z.string().min(1, 'Sora prompt is required'),
});

export type CareerPrompt = z.infer<typeof CareerPromptSchema>;

const CareerPromptsSchema = z.array(CareerPromptSchema);

export interface ParsedCareer {
  career: string;
  prompt: string;
  slug: string;
}

/**
 * Convert career name to URL-safe slug
 */
function createSlug(careerName: string): string {
  return careerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse the CSV file containing career prompts
 * @param csvPath - Path to the CSV file (relative to project root)
 * @returns Array of parsed career data
 */
export function parseCareerPrompts(csvPath: string): ParsedCareer[] {
  try {
    // Read and parse CSV file
    const fileContent = readFileSync(csvPath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Validate with Zod
    const validatedRecords = CareerPromptsSchema.parse(records);

    // Transform to our internal format
    const careers: ParsedCareer[] = validatedRecords
      .filter(record => record.career && record.sora_prompt)
      .map(record => ({
        career: record.career,
        prompt: record.sora_prompt,
        slug: createSlug(record.career),
      }));

    console.log(`✓ Parsed ${careers.length} career prompts from CSV`);
    return careers;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ CSV validation error:', error.errors);
      throw new Error(`Invalid CSV format: ${error.errors[0].message}`);
    }
    throw error;
  }
}

/**
 * Get default CSV path relative to the sora directory
 */
export function getDefaultCsvPath(): string {
  return path.join(process.cwd(), 'vhwda_sora_prompts_updated.csv');
}

