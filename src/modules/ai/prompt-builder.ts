/**
 * Prompt Builder
 * Constructs structured prompts for Gemini API
 */

import type { TripPlanInput, RecommendationInput } from './ai.validation';

export const promptBuilder = {
  /**
   * Build trip planner prompt
   */
  buildTripPlanPrompt: (input: TripPlanInput): string => {
    return `
You are an expert travel planner. Create a detailed travel itinerary based on the following information:

Destination: ${input.destination}
Budget: ${input.budget} (local currency)
Duration: ${input.days} days
Travel Style: ${input.travelStyle}
Interests: ${input.interests.join(', ')}

Please provide:
1. Day-wise detailed itinerary (1-2 activities per day)
2. Estimated budget breakdown
3. Recommended hotels (budget range)
4. Transportation tips
5. Food recommendations
6. Travel tips and warnings
7. Packing list

Format the response in clear markdown with sections for each category.
Keep recommendations practical and budget-conscious.
    `.trim();
  },

  /**
   * Build recommendation prompt
   */
  buildRecommendationPrompt: (input: RecommendationInput): string => {
    return `
You are a travel expert recommending destinations. Suggest the best destinations based on:

Budget: ${input.budget} (local currency)
Season: ${input.season}
Group Type: ${input.groupType}
Interests: ${input.interests.join(', ')}

Please provide:
1. Top 3 recommended destinations with reasons
2. Why each is suitable for the given budget and season
3. Alternative budget-friendly options
4. Best time to visit
5. Travel tips for each destination

Format the response in markdown with clear sections.
Make recommendations practical and diverse.
    `.trim();
  },

  /**
   * Build chat prompt
   */
  buildChatPrompt: (message: string, conversationHistory?: string): string => {
    return `
You are a helpful travel assistant for VoyageAI. Answer travel-related questions.

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}

User question: ${message}

Provide helpful, concise travel advice. If you need clarification, ask follow-up questions.
Keep responses under 200 words.
    `.trim();
  },
};
