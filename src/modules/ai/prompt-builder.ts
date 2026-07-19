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
  "hotels": [
    {"name": "Hotel name", "type": "Hotel category", "pricePerNight": "Price range per night", "rating": number}
  ],
  "transportation": [
    {"type": "Method", "details": "How/where to use it", "estimatedCost": "Estimated cost"}
  ],
  "food": [
    {"restaurant": "Restaurant/food name", "cuisine": "Cuisine type", "recommendation": "What to try with estimated cost"}
  ],
  "activities": [
    {"activity": "Activity name", "description": "Short description", "bestTime": "Best time to do it"}
  ],
  "tips": ["Travel tip 1", "Travel tip 2", ...],
  "packing": ["Item 1", "Item 2", ...]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting
- Days must have 1-3 activities
- "rating" must be a number between 1 and 5
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
You are an expert travel recommendation AI. Recommend the best destinations based on the user's preferences:

PREFERENCES:
- Budget: ${input.budget} (local currency)
- Preferred Season: ${input.preferredSeason}
- Travel Style: ${input.travelStyle}
- Group Type: ${input.groupType}
- Interests: ${input.interests.join(', ')}

RESPONSE FORMAT - Provide ONLY valid JSON (no markdown, no extra text):
{
  "destinations": [
    {
      "name": "Destination Name",
      "country": "Country",
      "reason": "Why this is recommended for the given preferences",
      "estimatedBudget": number,
      "bestTimeToVisit": "Month or season",
      "mustVisitAttractions": ["Attraction 1", "Attraction 2", "Attraction 3"],
      "travelTips": ["Tip 1", "Tip 2"],
      "suggestedDuration": "Number of days"
    }
  ],
  "alternatives": [
    {
      "name": "Alternative Destination",
      "reason": "Budget-friendly alternative",
      "estimatedBudget": number
    }
  ],
  "generalTips": ["Tip 1", "Tip 2", "Tip 3"]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown formatting
- Suggest 3 primary destinations
- Provide 2-3 alternative destinations
- Budget estimates must be realistic for the destination
- Include practical, actionable recommendations
- Consider the season and travel style in all suggestions
    `.trim();
  },

  /**
   * Build chat prompt
   */
  buildChatPrompt: (message: string, context?: string): string => {
    return `
You are a knowledgeable, friendly travel assistant for VoyageAI. Answer travel-related questions in a helpful, realistic, and practical way.

${context ? `Conversation history:\n${context}\n\n` : ''}

User message: ${message}

GUIDELINES:
- Give a medium-length, well-rounded answer (roughly 100-250 words).
- Be specific and realistic: mention concrete places, approximate costs, timing, and practical tips where relevant.
- Use short paragraphs or bullet points for readability when listing options.
- Stay conversational and friendly, not robotic.
- Do not use markdown headers or bold; plain text with simple bullets ("- ") is fine.
    `.trim();
  },
};
