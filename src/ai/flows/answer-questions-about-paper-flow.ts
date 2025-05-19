'use server';

/**
 * @fileOverview An AI agent that answers questions about a research paper.
 *
 * - answerQuestionsAboutPaper - A function that handles the question answering process.
 * - AnswerQuestionsAboutPaperInput - The input type for the answerQuestionsAboutPaper function.
 * - AnswerQuestionsAboutPaperOutput - The return type for the answerQuestionsAboutPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutPaperInputSchema = z.object({
  paperText: z.string().describe('The text content of the research paper.'),
  question: z.string().describe('The question about the research paper.'),
});
export type AnswerQuestionsAboutPaperInput = z.infer<
  typeof AnswerQuestionsAboutPaperInputSchema
>;

const AnswerQuestionsAboutPaperOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the paper.'),
});
export type AnswerQuestionsAboutPaperOutput = z.infer<
  typeof AnswerQuestionsAboutPaperOutputSchema
>;

export async function answerQuestionsAboutPaper(
  input: AnswerQuestionsAboutPaperInput
): Promise<AnswerQuestionsAboutPaperOutput> {
  return answerQuestionsAboutPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutPaperPrompt',
  input: {schema: AnswerQuestionsAboutPaperInputSchema},
  output: {schema: AnswerQuestionsAboutPaperOutputSchema},
  prompt: `You are a chatbot that answers questions about research papers.
  Use the following research paper to answer the user's question. If the answer is not in the paper, respond with that information.

  Research Paper:
  {{paperText}}

  Question: {{question}}
  `,
});

const answerQuestionsAboutPaperFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutPaperFlow',
    inputSchema: AnswerQuestionsAboutPaperInputSchema,
    outputSchema: AnswerQuestionsAboutPaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
