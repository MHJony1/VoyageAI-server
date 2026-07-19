import { Destination } from '../../models/destination.model';
import { NotFoundError } from '../../errors/AppError';
import type {
  CreateDestinationInput,
  UpdateDestinationInput,
  ListDestinationsInput,
} from './destination.validation';
import type { IDestinationResponse, IListDestinationsResult } from './destination.interface';

/**
 * Destination Service
 * Contains business logic for destination operations
 */

const toResponse = (doc: any): IDestinationResponse => ({
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
  duration: doc.duration,
  bestTimeDescription: doc.bestTimeDescription,
  highlights: doc.highlights,
  included: doc.included,
  excluded: doc.excluded,
  travelTips: doc.travelTips,
  weather: doc.weather,
  currency: doc.currency,
  language: doc.language,
  latitude: doc.latitude,
  longitude: doc.longitude,
  mapUrl: doc.mapUrl,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

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

    return toResponse(destination);
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

    const data: IDestinationResponse[] = dbData.map(toResponse);

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
    return destinations.map(toResponse);
  },

  /**
   * Get distinct countries present in the destinations collection
   */
  getCountries: async (): Promise<string[]> => {
    const countries = await Destination.distinct('country');
    return (countries as string[])
      .filter((c) => typeof c === 'string' && c.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));
  },

  /**
   * Get destination by ID
   */
  getById: async (id: string): Promise<IDestinationResponse> => {
    const doc = await Destination.findById(id).lean();
    if (!doc) {
      throw new NotFoundError('Destination not found');
    }
    return toResponse(doc);
  },

  /**
   * Update destination
   */
  update: async (id: string, data: UpdateDestinationInput): Promise<IDestinationResponse> => {
    const doc = await Destination.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!doc) {
      throw new NotFoundError('Destination not found');
    }
    return toResponse(doc);
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
