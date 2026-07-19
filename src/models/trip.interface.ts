import { Document, Types } from 'mongoose';

export interface ITrip extends Document {
  userId: Types.ObjectId;
  destinationId?: Types.ObjectId;
  destination: string;
  days: number;
  budget: number;
  travelStyle: string;
  interests: string[];
  itinerary: string;
  estimatedCost: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
