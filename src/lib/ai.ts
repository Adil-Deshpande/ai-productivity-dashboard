import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Helper to call the AI model with structured JSON generation.
 * This guarantees that the response matches the provided Zod schema.
 */
export async function generateStructuredData<T>(
  prompt: string,
  schema: z.ZodSchema<T>,
  systemPrompt?: string
): Promise<T> {
  const result = await generateObject({
    model: openrouter(process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash'),
    schema,
    prompt,
    system: systemPrompt || 'You are an intelligent goal and task planning assistant.',
    temperature: 0.7,
  });

  return result.object;
}
