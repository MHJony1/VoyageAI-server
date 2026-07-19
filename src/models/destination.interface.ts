import { Document } from 'mongoose';

export interface IDestination extends Document {
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
  published: boolean;
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
