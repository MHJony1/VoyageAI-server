import { logger } from '../../utils/logger';

/**
 * Response Parser
 * Parses and formats Gemini API responses
 */

export const responseParser = {
  /**
   * Parse trip plan response
   */
  parseTripPlan: (response: string): any => {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        overview: parsed.overview || '',
        itinerary: parsed.itinerary || [],
        budget: parsed.budget || {},
        hotels: parsed.hotels || [],
        transportation: parsed.transportation || [],
        food: parsed.food || [],
        activities: parsed.activities || [],
        tips: parsed.tips || [],
        packing: parsed.packing || [],
      };
    } catch (error) {
      logger.error('Failed to parse trip plan response:', error);
      // Return a fallback structure if parsing fails
      return {
        overview: response.substring(0, 200),
        itinerary: [],
        budget: {},
        hotels: [],
        transportation: [],
        food: [],
        activities: [],
        tips: [],
        packing: [],
      };
    }
  },

  /**
   * Parse recommendation response
   */
  parseRecommendation: (response: string): any => {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        destinations: parsed.destinations || [],
        alternatives: parsed.alternatives || [],
        generalTips: parsed.generalTips || [],
      };
    } catch (error) {
      console.error('Failed to parse recommendation response:', error);
      // Return a fallback structure if parsing fails
      return {
        destinations: [],
        alternatives: [],
        generalTips: [],
      };
    }
  },

  /**
   * Parse chat response
   */
  parseChat: (response: string): { message: string; suggestions?: string[] } => {
    return {
      message: response.trim(),
    };
  },

  /**
   * Clean markdown response
   */
  cleanMarkdown: (text: string): string => {
    return text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/#+\s/g, '') // Remove headers
      .trim();
  },
};
