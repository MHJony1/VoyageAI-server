import { Trip } from '../../models/trip.model';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';
import type { CreateTripInput, UpdateTripInput } from './trip.validation';
import type { ITripResponse, IMyTripsResult } from './trip.interface';

/**
 * Trip Service
 * Contains business logic for trip operations
 */

const convertTripToResponse = (doc: any): ITripResponse => ({
  _id: doc._id.toString(),
  userId: doc.userId.toString(),
  destinationId: doc.destinationId ? doc.destinationId.toString() : undefined,
  destination: doc.destination,
  days: doc.days,
  budget: doc.budget,
  travelStyle: doc.travelStyle,
  interests: doc.interests,
  itinerary: doc.itinerary,
  estimatedCost: doc.estimatedCost,
  status: doc.status,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const tripService = {
  /**
   * Create new trip
   */
  create: async (userId: string, data: CreateTripInput): Promise<ITripResponse> => {
    const trip = await Trip.create({
      userId,
      ...data,
      interests: data.interests || [],
    });

    return convertTripToResponse(trip.toObject());
  },

  /**
   * Get user's trips with pagination
   */
  getMyTrips: async (userId: string, page: number, limit: number): Promise<IMyTripsResult> => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Trip.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Trip.countDocuments({ userId }),
    ]);

    return {
      data: data.map((doc: any) => convertTripToResponse(doc)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get trip by ID with ownership check
   */
  getById: async (tripId: string, userId: string): Promise<ITripResponse> => {
    const doc = await Trip.findById(tripId).lean();
    if (!doc) {
      throw new NotFoundError('Trip not found');
    }

    if (doc.userId.toString() !== userId) {
      throw new ForbiddenError('Not authorized to access this trip');
    }

    return convertTripToResponse(doc);
  },

  /**
   * Update trip with ownership check
   */
  update: async (tripId: string, userId: string, data: UpdateTripInput): Promise<ITripResponse> => {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.userId.toString() !== userId) {
      throw new ForbiddenError('Not authorized to update this trip');
    }

    Object.assign(trip, data);
    await trip.save();

    return convertTripToResponse(trip.toObject());
  },

  /**
   * Delete trip with ownership check
   */
  delete: async (tripId: string, userId: string): Promise<void> => {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new NotFoundError('Trip not found');
    }

    if (trip.userId.toString() !== userId) {
      throw new ForbiddenError('Not authorized to delete this trip');
    }

    await Trip.findByIdAndDelete(tripId);
  },
};
