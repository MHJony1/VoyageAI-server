/**
 * Trip Module - Type Definitions
 */

export interface ITripResponse {
  _id: string;
  userId: string;
  destinationId?: string;
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

export interface IMyTripsResult {
  data: ITripResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
