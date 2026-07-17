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
You are an expert travel planner. Create a detailed, practical ${input.numberOfDays}-day travel itinerary for the following trip:

TRIP DETAILS:
- Destination: ${input.destination}
- Total Budget: ${input.budget} (local currency)
- Duration: ${input.numberOfDays} days
- Travel Style: ${input.travelStyle}
- Group Type: ${input.groupType || 'Not specified'}
- Preferred Season: ${input.preferredSeason || 'Any'}
- Interests: ${input.interests.join(', ')}

RESPONSE FORMAT - Provide ONLY valid JSON (no markdown, no extra text):
{
  "overview": "2-3 sentence summary of the trip",
  "itinerary": [
    {"day": 1, "title": "Day Title", "activities": ["Activity 1", "Activity 2"], "meals": {"breakfast": "Location/Type", "lunch": "Location/Type", "dinner": "Location/Type"}}
  ],
  "budget": {
    "accommodation": number,
    "food": number,
    "activities": number,
    "transportation": number,
    "other": number,
    "total": number
  },
  "hotels": ["Hotel name with price range per night", ...],
  "transportation": ["Method with estimated cost", ...],
  "food": ["Restaurant/food type with estimated cost", ...],
  "activities": ["Activity with estimated cost", ...],
  "tips": ["Travel tip 1", "Travel tip 2", ...],
  "packing": ["Item 1", "Item 2", ...]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting
- Days must have 1-3 activities
- Budget numbers must be realistic for the destination
- Include practical, actionable recommendations
- All costs should be in the local currency mentioned
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
