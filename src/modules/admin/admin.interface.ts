/**
 * Admin Module - Type Definitions
 */

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: IPagination;
}

export interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  provider: string;
  role: string;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUserRef {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface IAdminTrip {
  _id: string;
  user: IAdminUserRef | null;
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

export interface IAdminReview {
  _id: string;
  user: IAdminUserRef | null;
  destination: { _id: string; title: string; country: string } | null;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminAIHistory {
  _id: string;
  user: IAdminUserRef | null;
  type: string;
  prompt: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMonthlyPoint {
  month: string;
  count: number;
}

export interface INamedCount {
  name: string;
  count: number;
}

export interface IAdminOverview {
  counts: {
    users: number;
    destinations: number;
    trips: number;
    reviews: number;
    aiHistories: number;
  };
  blockedUsers: number;
  featuredDestinations: number;
  monthlyUsers: IMonthlyPoint[];
  monthlyTrips: IMonthlyPoint[];
  monthlyReviews: IMonthlyPoint[];
  monthlyAI: IMonthlyPoint[];
  tripStatusDistribution: INamedCount[];
  destinationsByCategory: INamedCount[];
  aiTypeDistribution: INamedCount[];
  recentUsers: IAdminUserRef[];
  recentTrips: { _id: string; destination: string; user: string; createdAt: Date }[];
}
