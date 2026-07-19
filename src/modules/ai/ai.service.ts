import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIHistory } from '../../models/aiHistory.model';
import { config } from '../../config/environment';
import { AppError } from '../../errors/AppError';
import { logger } from '../../utils/logger';
import { promptBuilder } from './prompt-builder';
import { responseParser } from './response-parser';
import type { TripPlanInput, RecommendationInput, ChatInput } from './ai.validation';
import type { IAIResponse } from './ai.interface';

let genAI: any;
try {
  genAI = new GoogleGenerativeAI(config.geminiApiKey);
} catch (initError: any) {
  console.error('[INIT ERROR] Gemini initialization failed:', initError?.message);
  throw initError;
}

// Try multiple model names - fallback if primary not available
// Note: Using 2.x and newer models (1.5 models not available with this key)
// Try lighter/newer models first (2.5 is newer than 2.0, flash-lite is lighter)
const MODEL_NAMES = [
  'gemini-flash-latest',       // Always points to current stable flash
  'gemini-flash-lite-latest',  // Lighter fallback
  'gemini-3.5-flash',          // Explicit newer model
  'gemini-2.0-flash',          // Legacy fallback
  'gemini-2.0-flash-001',
];
let MODEL_NAME = MODEL_NAMES[0];

interface AIRequestOptions {
  maxRetries?: number;
  retryDelay?: number;
}

async function callGeminiWithRetry(model: any, prompt: string, modelName: string = '', options: AIRequestOptions = {}) {
  const { maxRetries = 1, retryDelay = 1000 } = options;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error: any) {
      lastError = error;

      if (error.message?.includes('[429')) {
        if (attempt < maxRetries) {
          logger.debug(`Gemini API rate limit hit. Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
      throw error;
    }
  }

  throw lastError;
}

export const aiService = {
  generateTripPlan: async (userId: string, input: TripPlanInput): Promise<any> => {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = promptBuilder.buildTripPlanPrompt(input);

      logger.debug('Calling Gemini API for trip plan');
      const result = await callGeminiWithRetry(model, prompt);
      const rawResponse = result.response.text();

      const parsed = responseParser.parseTripPlan(rawResponse);

      await AIHistory.create({
        userId,
        type: 'planner',
        prompt: prompt.substring(0, 500),
        response: rawResponse.substring(0, 1000),
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
    } catch (error: any) {
      logger.error('Trip plan generation failed:', error?.message || error);
      if (error?.message?.includes('[429')) {
        throw new AppError('AI service is temporarily busy, please try again in a moment.', 503);
      }
      throw new AppError('Failed to generate trip plan. Please try again.', 500);
    }
  },

  generateRecommendation: async (userId: string, input: RecommendationInput): Promise<any> => {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = promptBuilder.buildRecommendationPrompt(input);

      logger.debug('Calling Gemini API for recommendation');
      const result = await callGeminiWithRetry(model, prompt);
      const rawResponse = result.response.text();

      const parsed = responseParser.parseRecommendation(rawResponse);

      await AIHistory.create({
        userId,
        type: 'recommendation',
        prompt: prompt.substring(0, 500),
        response: rawResponse.substring(0, 1000),
      });
      return {
        type: 'recommendation',
        destinations: parsed.destinations,
        alternatives: parsed.alternatives,
        generalTips: parsed.generalTips,
      };
    } catch (error: any) {
      logger.error('Recommendation generation failed:', error?.message || error);
      if (error?.message?.includes('[429')) {
        throw new AppError('AI service is temporarily busy, please try again in a moment.', 503);
      }
      throw new AppError('Failed to generate recommendation. Please try again.', 500);
    }
  },

  chat: async (input: ChatInput & { context?: string; conversationId?: string }): Promise<IAIResponse> => {
    let lastError: any;

    // Try each model in the list (fallback if one is unavailable)
    for (const modelName of MODEL_NAMES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = promptBuilder.buildChatPrompt(input.message, input.context);

        logger.debug(`Calling Gemini API for chat with model: ${modelName}`);
        const result = await callGeminiWithRetry(model, prompt, modelName);
        const response = result.response.text();

        const parsed = responseParser.parseChat(response);

        return {
          type: 'chat',
          response: parsed.message,
          conversationId: input.conversationId || `conv_${Date.now()}`,
        };
      } catch (error: any) {
        lastError = error;

        // Model unavailable (404) or busy (429) -> try next model; otherwise fail
        const isRetriableModel =
          error?.message?.includes('[404') || error?.message?.includes('[429');
        if (!isRetriableModel) {
          break;
        }
      }
    }

    logger.error('Chat generation failed:', lastError?.message || lastError);
    if (lastError?.message?.includes('[429')) {
      throw new AppError('AI service is temporarily busy, please try again in a moment.', 503);
    }
    throw new AppError('Failed to process your message. Please try again.', 500);
  },

  verifyConnection: async (): Promise<boolean> => {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await callGeminiWithRetry(model, 'Say "ready"');
      const response = result.response.text();
      logger.success('Gemini connection verified');
      return response.length > 0;
    } catch (error) {
      logger.error('Gemini connection failed:', error);
      return false;
    }
  },
};
