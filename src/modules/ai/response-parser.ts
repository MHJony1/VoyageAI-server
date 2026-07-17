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
      console.error('Failed to parse trip plan response:', error);
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
  parseRecommendation: (response: string): { destinations: string[]; tips: string[] } => {
    const lines = response.split('\n');
    const destinations: string[] = [];
    const tips: string[] = [];

    let currentSection = '';
    for (const line of lines) {
      if (line.toLowerCase().includes('destination')) {
        currentSection = 'destination';
      } else if (line.toLowerCase().includes('tip')) {
        currentSection = 'tips';
      }

      if (currentSection === 'destination' && (line.startsWith('#') || line.startsWith('-'))) {
        destinations.push(line.replace(/^#+\s*|-\s*/, ''));
      } else if (currentSection === 'tips' && (line.startsWith('-') || line.startsWith('*'))) {
        tips.push(line.replace(/^[-*]\s*/, ''));
      }
    }

    return {
      destinations: destinations.slice(0, 5),
      tips: tips.slice(0, 5),
    };
  },

  /**
   * Parse chat response
   */
  parseChat: (response: string): { message: string; suggestions?: string[] } => {
    const lines = response.split('\n');
    const message = lines[0] || response;
    const suggestions = lines.slice(1).filter((l) => l.trim().length > 0);

    return {
      message: message.trim(),
      suggestions: suggestions.slice(0, 3),
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
