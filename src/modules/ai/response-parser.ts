/**
 * Response Parser
 * Parses and formats Gemini API responses
 */

export const responseParser = {
  /**
   * Parse trip plan response
   */
  parseTripPlan: (response: string): { itinerary: string; tips: string[] } => {
    // Extract markdown sections
    const sections = response.split('##').map((s) => s.trim());
    const tips: string[] = [];

    // Extract travel tips if present
    const tipsSection = sections.find((s) => s.toLowerCase().includes('tip'));
    if (tipsSection) {
      const lines = tipsSection
        .split('\n')
        .filter((l) => l.startsWith('-') || l.startsWith('*'));
      tips.push(...lines.map((l) => l.replace(/^[-*]\s*/, '')));
    }

    return {
      itinerary: response,
      tips: tips.slice(0, 5),
    };
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
