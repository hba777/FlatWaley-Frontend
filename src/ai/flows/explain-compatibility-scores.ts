'use server';

/**
 * @fileOverview Generates explanations for compatibility scores between users.
 *
 * - explainCompatibilityScores - A function that takes two user profiles and returns an explanation of their compatibility.
 * - ExplainCompatibilityScoresInput - The input type for the explainCompatibilityScores function.
 * - ExplainCompatibilityScoresOutput - The return type for the explainCompatibilityScores function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCompatibilityScoresInputSchema = z.object({
  userProfile1: z.object({
    name: z.string().describe('The name of the first user.'),
    university: z.string().describe('The university of the first user.'),
    budget: z.string().describe('The budget range of the first user.'),
    sleepSchedule: z.string().describe('The sleep schedule of the first user (e.g., early bird, night owl).'),
    cleanliness: z.string().describe('The cleanliness preference of the first user (e.g., very clean, somewhat clean, not very clean).'),
    studyHabits: z.string().describe('The study habits of the first user (e.g., quiet study, collaborative study).'),
    foodPreferences: z.string().describe('The food preferences of the first user (e.g., vegetarian, vegan, omnivore).'),
  }).describe('The profile of the first user.'),
  userProfile2: z.object({
    name: z.string().describe('The name of the second user.'),
    university: z.string().describe('The university of the second user.'),
    budget: z.string().describe('The budget range of the second user.'),
    sleepSchedule: z.string().describe('The sleep schedule of the second user (e.g., early bird, night owl).'),
    cleanliness: z.string().describe('The cleanliness preference of the second user (e.g., very clean, somewhat clean, not very clean).'),
    studyHabits: z.string().describe('The study habits of the second user (e.g., quiet study, collaborative study).'),
    foodPreferences: z.string().describe('The food preferences of the second user (e.g., vegetarian, vegan, omnivore).'),
  }).describe('The profile of the second user.'),
  compatibilityScore: z.number().describe('The numeric compatibility score between the two users.')
});
export type ExplainCompatibilityScoresInput = z.infer<typeof ExplainCompatibilityScoresInputSchema>;

const ExplainCompatibilityScoresOutputSchema = z.object({
  explanation: z.string().describe('A friendly, transparent explanation of the compatibility score between the two users.'),
});
export type ExplainCompatibilityScoresOutput = z.infer<typeof ExplainCompatibilityScoresOutputSchema>;

export async function explainCompatibilityScores(input: ExplainCompatibilityScoresInput): Promise<ExplainCompatibilityScoresOutput> {
  return explainCompatibilityScoresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCompatibilityScoresPrompt',
  input: {schema: ExplainCompatibilityScoresInputSchema},
  output: {schema: ExplainCompatibilityScoresOutputSchema},
  prompt: `You are an AI assistant designed to explain compatibility scores between two potential roommates in a friendly and transparent manner.

  Based on the following profiles and compatibility score, generate a short explanation of why these two users matched or mismatched.

  User 1: {{userProfile1.name}} from {{userProfile1.university}}
  - Budget: {{userProfile1.budget}}
  - Sleep Schedule: {{userProfile1.sleepSchedule}}
  - Cleanliness: {{userProfile1.cleanliness}}
  - Study Habits: {{userProfile1.studyHabits}}
  - Food Preferences: {{userProfile1.foodPreferences}}

  User 2: {{userProfile2.name}} from {{userProfile2.university}}
  - Budget: {{userProfile2.budget}}
  - Sleep Schedule: {{userProfile2.sleepSchedule}}
  - Cleanliness: {{userProfile2.cleanliness}}
  - Study Habits: {{userProfile2.studyHabits}}
  - Food Preferences: {{userProfile2.foodPreferences}}

  Compatibility Score: {{compatibilityScore}}

  Explanation:`,
});

const explainCompatibilityScoresFlow = ai.defineFlow(
  {
    name: 'explainCompatibilityScoresFlow',
    inputSchema: ExplainCompatibilityScoresInputSchema,
    outputSchema: ExplainCompatibilityScoresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
