
'use server';
/**
 * @fileOverview Handles answering questions about a research paper.
 *
 * - answerQuestionsAboutPaper - A function to answer questions.
 * - AnswerQuestionsInput - Input type for answering questions.
 * - AnswerQuestionsOutput - Output type for answering questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsInputSchema = z.object({
  paperText: z.string().describe('The full text of the research paper.'),
  question: z.string().describe('The user’s question about the paper.'),
  eli5: z
    .boolean()
    .default(false)
    .describe(
      'Whether to explain the answer in simple terms (Explain Like I’m 5).'
    ),
});
export type AnswerQuestionsInput = z.infer<typeof AnswerQuestionsInputSchema>;

const AnswerQuestionsOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});
export type AnswerQuestionsOutput = z.infer<typeof AnswerQuestionsOutputSchema>;

export async function answerQuestionsAboutPaper(
  input: AnswerQuestionsInput
): Promise<AnswerQuestionsOutput> {
  return answerQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsPrompt',
  input: {schema: AnswerQuestionsInputSchema},
  output: {schema: AnswerQuestionsOutputSchema},
  prompt: `You are an expert academic assistant. A user has provided a research paper and has a question about it.
Answer the question based SOLELY on the content of the research paper provided. Do not use external knowledge.
If the information to answer the question is not in the paper, state that clearly.

Research Paper Text:
{{{paperText}}}

User's Question: "{{{question}}}"

{{#if eli5}}
Explain your answer in very simple terms, as if you were explaining it to a 5-year-old.
{{/if}}
`,
});

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
