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
  createdAt: Date;
  updatedAt: Date;
}
