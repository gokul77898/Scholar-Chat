'use server';

/**
 * @fileOverview Summarizes a research paper.
 *
 * - summarizeResearchPaper - A function that handles the summarization process.
 * - SummarizeResearchPaperInput - The input type for the summarizeResearchPaper function.
 * - SummarizeResearchPaperOutput - The return type for the summarizeResearchPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeResearchPaperInputSchema = z.object({
  paperText: z.string().describe('The text content of the research paper.'),
  complexity: z
    .string()
    .default('simple')
    .describe(
      'How detailed and complex the summary should be. Options: simple, detailed.'
    ),
  language: z
    .string()
    .default('English')
    .describe('The language to summarize the paper in.'),
});
export type SummarizeResearchPaperInput = z.infer<
  typeof SummarizeResearchPaperInputSchema
>;

const SummarizeResearchPaperOutputSchema = z.object({
  summary: z.string().describe('The summary of the research paper.'),
});
export type SummarizeResearchPaperOutput = z.infer<
  typeof SummarizeResearchPaperOutputSchema
>;

export async function summarizeResearchPaper(
  input: SummarizeResearchPaperInput
): Promise<SummarizeResearchPaperOutput> {
  return summarizeResearchPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeResearchPaperPrompt',
  input: {schema: SummarizeResearchPaperInputSchema},
  output: {schema: SummarizeResearchPaperOutputSchema},
  prompt: `You are an expert research paper summarizer.

  Summarize the following research paper in {{{language}}} language.
  The summary should be of {{{complexity}}} complexity.

  Research Paper Text: {{{paperText}}}`,
});

const summarizeResearchPaperFlow = ai.defineFlow(
  {
    name: 'summarizeResearchPaperFlow',
    inputSchema: SummarizeResearchPaperInputSchema,
    outputSchema: SummarizeResearchPaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
