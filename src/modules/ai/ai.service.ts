import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIHistory } from '../../models/aiHistory.model';
import { config } from '../../config/environment';
import { AppError } from '../../errors/AppError';
import { logger } from '../../utils/logger';
import { promptBuilder } from './prompt-builder';
import { responseParser } from './response-parser';
import type { TripPlanInput, RecommendationInput, ChatInput } from './ai.validation';
import type { IAIResponse } from './ai.interface';

/**
 * AI Service
 * Handles Gemini API integration
 */

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

export const aiService = {
  /**
   * Generate trip plan
   */
  generateTripPlan: async (userId: string, input: TripPlanInput): Promise<any> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = promptBuilder.buildTripPlanPrompt(input);

      logger.debug('Calling Gemini API for trip plan');
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();

      const parsed = responseParser.parseTripPlan(rawResponse);

      // Save to AIHistory
      await AIHistory.create({
        userId,
        type: 'planner',
        prompt: prompt.substring(0, 500), // Save first 500 chars of prompt
        response: rawResponse.substring(0, 1000), // Save first 1000 chars of response
      });

      return {
        type: 'trip-plan',
        overview: parsed.overview,
        itinerary: parsed.itinerary,
        budget: parsed.budget,
        hotels: parsed.hotels,
        transportation: parsed.transportation,
        food: parsed.food,
        activities: parsed.activities,
        tips: parsed.tips,
        packing: parsed.packing,
      };
    } catch (error) {
      logger.error('Trip plan generation failed:', error);
      throw new AppError('Failed to generate trip plan. Please try again.', 500);
    }
  },

  /**
   * Generate recommendation
   */
  generateRecommendation: async (userId: string, input: RecommendationInput): Promise<any> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = promptBuilder.buildRecommendationPrompt(input);

      logger.debug('Calling Gemini API for recommendation');
      const result = await model.generateContent(prompt);
      const rawResponse = result.response.text();

      const parsed = responseParser.parseRecommendation(rawResponse);

      // Save to AIHistory
      await AIHistory.create({
        userId,
        type: 'recommendation',
        prompt: prompt.substring(0, 500), // Save first 500 chars of prompt
        response: rawResponse.substring(0, 1000), // Save first 1000 chars of response
      });
      return {
        type: 'recommendation',
        destinations: parsed.destinations,
        alternatives: parsed.alternatives,
        generalTips: parsed.generalTips,
      };
    } catch (error: any) {
      logger.error('Recommendation generation failed:', error?.message || error);
      throw new AppError('Failed to generate recommendation. Please try again.', 500);
    }
  },

  /**
   * Chat with AI
   */
  chat: async (input: ChatInput): Promise<IAIResponse> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = promptBuilder.buildChatPrompt(input.message);

      logger.debug('Calling Gemini API for chat');
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const parsed = responseParser.parseChat(response);

      // Generate or use existing conversation ID
      const conversationId = input.conversationId || `conv_${Date.now()}`;

      return {
        type: 'chat',
        response: parsed.message,
        conversationId,
      };
    } catch (error) {
      logger.error('Chat generation failed:', error);
      throw new AppError('Failed to process your message. Please try again.', 500);
    }
  },

  /**
   * Verify Gemini connection
   */
  verifyConnection: async (): Promise<boolean> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent('Say "ready"');
      const response = result.response.text();
      logger.success('Gemini connection verified');
      return response.length > 0;
    } catch (error) {
      logger.error('Gemini connection failed:', error);
      return false;
    }
  },
};
