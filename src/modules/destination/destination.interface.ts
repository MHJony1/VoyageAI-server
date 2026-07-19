/**
 * Destination Module - Type Definitions
 */

export interface IDestinationResponse {
  _id: string;
  title: string;
  country: string;
  category: string;
  description: string;
  location: string;
  thumbnail: string;
  gallery: string[];
  rating: number;
  estimatedBudget: number;
  bestSeason: string;
  featured: boolean;
  duration?: string;
  bestTimeDescription?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  travelTips?: string[];
  weather?: string;
  currency?: string;
  language?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListDestinationsParams {
  page: number;
  limit: number;
  search?: string;
  country?: string;
  category?: string;
  sort?: 'rating' | 'budget';
}

export interface IListDestinationsResult {
  data: IDestinationResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
