
'use server';
/**
 * @fileOverview Extracts keywords from a research paper.
 *
 * - extractKeywords - A function that handles the keyword extraction process.
 * - ExtractKeywordsInput - The input type for the extractKeywords function.
 * - ExtractKeywordsOutput - The return type for the extractKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeywordsInputSchema = z.object({
  paperText: z.string().describe('The text content of the research paper.'),
});
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of extracted keywords or key phrases. Should be between 5 to 10 keywords.'),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;

export async function extractKeywords(
  input: ExtractKeywordsInput
): Promise<ExtractKeywordsOutput> {
  return extractKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeywordsPrompt',
  input: {schema: ExtractKeywordsInputSchema},
  output: {
    format: 'json', // Request JSON output
    schema: ExtractKeywordsOutputSchema
  },
  prompt: `You are an expert in identifying key concepts in scientific texts.
  Extract the top 7-10 most important and relevant keywords or short key phrases from the following research paper text.
  Prioritize terms that are central to the paper's main topic, methodology, and findings.
  Return them as a JSON array of strings under the "keywords" key.

  Research Paper Text:
  {{{paperText}}}
  `,
  config: {
    temperature: 0.2, // Lower temperature for more deterministic keyword extraction
  }
});

const extractKeywordsFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null and keywords is an array, even if empty
    return { keywords: output?.keywords || [] };
  }
);
