import { Destination } from '../../models/destination.model';
import { NotFoundError } from '../../errors/AppError';
import type { CreateDestinationInput, ListDestinationsInput } from './destination.validation';
import type { IDestinationResponse, IListDestinationsResult } from './destination.interface';

/**
 * Destination Service
 * Contains business logic for destination operations
 */

export const destinationService = {
  /**
   * Create new destination
   */
  create: async (data: CreateDestinationInput): Promise<IDestinationResponse> => {
    const destination = await Destination.create({
      ...data,
      gallery: data.gallery || [],
      featured: data.featured || false,
    });

    return {
      _id: destination._id.toString(),
      title: destination.title,
      country: destination.country,
      category: destination.category,
      description: destination.description,
      location: destination.location,
      thumbnail: destination.thumbnail,
      gallery: destination.gallery,
      rating: destination.rating,
      estimatedBudget: destination.estimatedBudget,
      bestSeason: destination.bestSeason,
      featured: destination.featured,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  },

  /**
   * Get all destinations with search, filters, sorting, pagination
   */
  getAll: async (params: ListDestinationsInput): Promise<IListDestinationsResult> => {
    const { page, limit, search, country, category, sort } = params;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Build sort
    let sortBy: any = {};
    if (sort === 'rating') {
      sortBy = { rating: -1 };
    } else if (sort === 'budget') {
      sortBy = { estimatedBudget: 1 };
    } else {
      sortBy = { createdAt: -1 };
    }

    // Execute query
    const [dbData, total] = await Promise.all([
      Destination.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
      Destination.countDocuments(query),
    ]);

    const data: IDestinationResponse[] = dbData.map((doc: any) => ({
      _id: doc._id.toString(),
      title: doc.title,
      country: doc.country,
      category: doc.category,
      description: doc.description,
      location: doc.location,
      thumbnail: doc.thumbnail,
      gallery: doc.gallery,
      rating: doc.rating,
      estimatedBudget: doc.estimatedBudget,
      bestSeason: doc.bestSeason,
      featured: doc.featured,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get featured destinations
   */
  getFeatured: async (): Promise<IDestinationResponse[]> => {
    const destinations = await Destination.find({ featured: true }).limit(6).lean();
    return destinations.map((doc: any) => ({
      _id: doc._id.toString(),
      title: doc.title,
      country: doc.country,
      category: doc.category,
      description: doc.description,
      location: doc.location,
      thumbnail: doc.thumbnail,
      gallery: doc.gallery,
      rating: doc.rating,
      estimatedBudget: doc.estimatedBudget,
      bestSeason: doc.bestSeason,
      featured: doc.featured,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  },

  /**
   * Get destination by ID
   */
  getById: async (id: string): Promise<IDestinationResponse> => {
    const doc = await Destination.findById(id).lean();
    if (!doc) {
      throw new NotFoundError('Destination not found');
    }
    return {
      _id: (doc as any)._id.toString(),
      title: doc.title,
      country: doc.country,
      category: doc.category,
      description: doc.description,
      location: doc.location,
      thumbnail: doc.thumbnail,
      gallery: doc.gallery,
      rating: doc.rating,
      estimatedBudget: doc.estimatedBudget,
      bestSeason: doc.bestSeason,
      featured: doc.featured,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  },

  /**
   * Delete destination
   */
  delete: async (id: string): Promise<void> => {
    const result = await Destination.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError('Destination not found');
    }
  },
};
