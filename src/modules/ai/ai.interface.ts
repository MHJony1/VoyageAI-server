/**
 * AI Module - Type Definitions
 */

export interface ITripPlanRequest {
  destination: string;
  budget: number;
  numberOfDays: number;
  travelStyle: string;
  interests: string[];
  groupType?: string;
  preferredSeason?: string;
}

export interface IRecommendationRequest {
  budget: number;
  season: string;
  groupType: string;
  interests: string[];
}

export interface IChatRequest {
  message: string;
  conversationId?: string;
}

export interface IAIResponse {
  type: string;
  response: string;
  conversationId?: string;
}
