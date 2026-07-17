import { Review } from '../../models/review.model';
import { Destination } from '../../models/destination.model';
import { NotFoundError, ForbiddenError, ConflictError } from '../../errors/AppError';
import type { CreateReviewInput, UpdateReviewInput } from './review.validation';
import type { IReviewResponse, IReviewsResult } from './review.interface';

/**
 * Review Service
 * Contains business logic for review operations
 */

const convertReviewToResponse = (doc: any): IReviewResponse => ({
  _id: doc._id.toString(),
  userId: doc.userId.toString(),
  destinationId: doc.destinationId.toString(),
  rating: doc.rating,
  comment: doc.comment,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const updateDestinationRating = async (destinationId: string): Promise<void> => {
  const reviews = await Review.find({ destinationId });
  if (reviews.length === 0) {
    await Destination.findByIdAndUpdate(destinationId, { rating: 0 });
    return;
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Destination.findByIdAndUpdate(destinationId, { rating: Math.round(avgRating * 10) / 10 });
};

export const reviewService = {
  /**
   * Create new review
   */
  create: async (userId: string, data: CreateReviewInput): Promise<IReviewResponse> => {
    // Check if user already reviewed this destination
    const existing = await Review.findOne({
      userId,
      destinationId: data.destinationId,
    });

    if (existing) {
      throw new ConflictError('You have already reviewed this destination');
    }

    const review = await Review.create({
      userId,
      ...data,
    });

    // Update destination rating
    await updateDestinationRating(data.destinationId);

    return convertReviewToResponse(review.toObject());
  },

  /**
   * Get all reviews with pagination
   */
  getAll: async (page: number, limit: number): Promise<IReviewsResult> => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(),
    ]);

    return {
      data: data.map((doc: any) => convertReviewToResponse(doc)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get reviews for a destination
   */
  getByDestination: async (
    destinationId: string,
    page: number,
    limit: number,
  ): Promise<IReviewsResult> => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Review.find({ destinationId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments({ destinationId }),
    ]);

    return {
      data: data.map((doc: any) => convertReviewToResponse(doc)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get review by ID with ownership check
   */
  getById: async (reviewId: string, userId: string): Promise<IReviewResponse> => {
    const doc = await Review.findById(reviewId).lean();
    if (!doc) {
      throw new NotFoundError('Review not found');
    }

    if (doc.userId.toString() !== userId) {
      throw new ForbiddenError('Not authorized to access this review');
    }

    return convertReviewToResponse(doc);
  },

  /**
   * Update review with ownership check
   */
  update: async (
    reviewId: string,
    userId: string,
    data: UpdateReviewInput,
  ): Promise<IReviewResponse> => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new ForbiddenError('Not authorized to update this review');
    }

    Object.assign(review, data);
    await review.save();

    // Update destination rating
    await updateDestinationRating(review.destinationId.toString());

    return convertReviewToResponse(review.toObject());
  },

  /**
   * Delete review with ownership check
   */
  delete: async (reviewId: string, userId: string): Promise<void> => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.userId.toString() !== userId) {
      throw new ForbiddenError('Not authorized to delete this review');
    }

    const destinationId = review.destinationId.toString();
    await Review.findByIdAndDelete(reviewId);

    // Update destination rating
    await updateDestinationRating(destinationId);
  },
};
