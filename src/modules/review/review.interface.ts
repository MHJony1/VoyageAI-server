/**
 * Review Module - Type Definitions
 */

export interface IReviewResponse {
  _id: string;
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewsResult {
  data: IReviewResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
