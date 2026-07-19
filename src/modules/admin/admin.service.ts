import { User } from '../../models/user.model';
import { Destination } from '../../models/destination.model';
import { Trip } from '../../models/trip.model';
import { Review } from '../../models/review.model';
import { AIHistory } from '../../models/aiHistory.model';
import { NotFoundError, ForbiddenError, ConflictError } from '../../errors/AppError';
import { destinationService } from '../destination/destination.service';
import { updateDestinationRating } from '../review/review.service';
import type {
  AdminListDestinationsInput,
  AdminCreateDestinationInput,
  AdminUpdateDestinationInput,
  AdminListUsersInput,
  AdminListTripsInput,
  AdminListReviewsInput,
  AdminListAIHistoryInput,
} from './admin.validation';
import type {
  IAdminOverview,
  IAdminUser,
  IAdminTrip,
  IAdminReview,
  IAdminAIHistory,
  IPaginatedResult,
  IAdminUserRef,
} from './admin.interface';

/* ------------------------------- Helpers -------------------------------- */

const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;

const monthlyAggregate = async (model: any): Promise<{ month: string; count: number }[]> => {
  const rows = await model.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);
  return rows.map((r: any) => ({ month: monthKey(r._id.year, r._id.month), count: r.count }));
};

const toUserRef = (u: any): IAdminUserRef | null =>
  u
    ? {
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
        photo: u.photo,
      }
    : null;

const toAdminUser = (u: any): IAdminUser => ({
  _id: u._id.toString(),
  name: u.name,
  email: u.email,
  photo: u.photo,
  provider: u.provider,
  role: u.role,
  blocked: !!u.blocked,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const adminService = {
  /* ------------------------------ Overview ------------------------------ */
  getOverview: async (): Promise<IAdminOverview> => {
    const [
      users,
      destinations,
      trips,
      reviews,
      aiHistories,
      blockedUsers,
      featuredDestinations,
    ] = await Promise.all([
      User.countDocuments(),
      Destination.countDocuments(),
      Trip.countDocuments(),
      Review.countDocuments(),
      AIHistory.countDocuments(),
      User.countDocuments({ blocked: true }),
      Destination.countDocuments({ featured: true }),
    ]);

    const [monthlyUsers, monthlyTrips, monthlyReviews, monthlyAI] = await Promise.all([
      monthlyAggregate(User),
      monthlyAggregate(Trip),
      monthlyAggregate(Review),
      monthlyAggregate(AIHistory),
    ]);

    const [tripStatusRows, categoryRows, aiTypeRows] = await Promise.all([
      Trip.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Destination.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AIHistory.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);

    const [recentUserDocs, recentTripDocs] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).lean(),
      Trip.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name').lean(),
    ]);

    return {
      counts: { users, destinations, trips, reviews, aiHistories },
      blockedUsers,
      featuredDestinations,
      monthlyUsers,
      monthlyTrips,
      monthlyReviews,
      monthlyAI,
      tripStatusDistribution: tripStatusRows.map((r: any) => ({
        name: r._id || 'unknown',
        count: r.count,
      })),
      destinationsByCategory: categoryRows.map((r: any) => ({
        name: r._id || 'unknown',
        count: r.count,
      })),
      aiTypeDistribution: aiTypeRows.map((r: any) => ({ name: r._id || 'unknown', count: r.count })),
      recentUsers: recentUserDocs.map(toUserRef).filter(Boolean) as IAdminUserRef[],
      recentTrips: recentTripDocs.map((t: any) => ({
        _id: t._id.toString(),
        destination: t.destination,
        user: t.userId?.name || 'Unknown',
        createdAt: t.createdAt,
      })),
    };
  },

  /* ---------------------------- Destinations ---------------------------- */
  listDestinations: async (params: AdminListDestinationsInput) => {
    const { page, limit, search, country, category, featured, published, sort } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    if (country) query.country = { $regex: country, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (featured) query.featured = featured === 'true';
    if (published) query.published = published === 'true';

    let sortBy: any = { createdAt: -1 };
    if (sort === 'rating') sortBy = { rating: -1 };
    else if (sort === 'budget') sortBy = { estimatedBudget: 1 };

    const [data, total] = await Promise.all([
      Destination.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
      Destination.countDocuments(query),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  createDestination: async (data: AdminCreateDestinationInput) => {
    return destinationService.create(data as any);
  },

  updateDestination: async (id: string, data: AdminUpdateDestinationInput) => {
    return destinationService.update(id, data as any);
  },

  deleteDestination: async (id: string) => {
    return destinationService.delete(id);
  },

  toggleFeature: async (id: string) => {
    const doc = await Destination.findById(id);
    if (!doc) throw new NotFoundError('Destination not found');
    doc.featured = !doc.featured;
    await doc.save();
    return destinationService.getById(id);
  },

  togglePublish: async (id: string) => {
    const doc = await Destination.findById(id);
    if (!doc) throw new NotFoundError('Destination not found');
    doc.published = !doc.published;
    await doc.save();
    return destinationService.getById(id);
  },

  /* -------------------------------- Users ------------------------------- */
  listUsers: async (params: AdminListUsersInput): Promise<IPaginatedResult<IAdminUser>> => {
    const { page, limit, search, role, blocked } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;
    if (blocked) query.blocked = blocked === 'true';

    const [data, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return {
      data: data.map(toAdminUser),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  changeRole: async (adminId: string, userId: string, role: string): Promise<IAdminUser> => {
    if (adminId === userId) {
      throw new ForbiddenError('You cannot change your own role');
    }
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    // Prevent removing the last remaining admin
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        throw new ConflictError('Cannot demote the last remaining admin');
      }
    }

    user.role = role;
    await user.save();
    return toAdminUser(user.toObject());
  },

  setBlocked: async (adminId: string, userId: string, blocked: boolean): Promise<IAdminUser> => {
    if (adminId === userId) {
      throw new ForbiddenError('You cannot block your own account');
    }
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    user.blocked = blocked;
    await user.save();
    return toAdminUser(user.toObject());
  },

  deleteUser: async (adminId: string, userId: string): Promise<void> => {
    if (adminId === userId) {
      throw new ForbiddenError('You cannot delete your own account');
    }
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        throw new ConflictError('Cannot delete the last remaining admin');
      }
    }

    await User.findByIdAndDelete(userId);
    // Clean up owned data
    await Promise.all([
      Trip.deleteMany({ userId }),
      AIHistory.deleteMany({ userId }),
      Review.deleteMany({ userId }),
    ]);
  },

  /* -------------------------------- Trips ------------------------------- */
  listTrips: async (params: AdminListTripsInput): Promise<IPaginatedResult<IAdminTrip>> => {
    const { page, limit, search, status } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) query.destination = { $regex: search, $options: 'i' };
    if (status) query.status = status;

    const [data, total] = await Promise.all([
      Trip.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email photo')
        .lean(),
      Trip.countDocuments(query),
    ]);

    return {
      data: data.map((t: any) => ({
        _id: t._id.toString(),
        user: toUserRef(t.userId),
        destination: t.destination,
        days: t.days,
        budget: t.budget,
        travelStyle: t.travelStyle,
        interests: t.interests || [],
        itinerary: t.itinerary,
        estimatedCost: t.estimatedCost,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  deleteTrip: async (id: string): Promise<void> => {
    const result = await Trip.findByIdAndDelete(id);
    if (!result) throw new NotFoundError('Trip not found');
  },

  /* ------------------------------- Reviews ------------------------------ */
  listReviews: async (params: AdminListReviewsInput): Promise<IPaginatedResult<IAdminReview>> => {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) query.comment = { $regex: search, $options: 'i' };

    const [data, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email photo')
        .populate('destinationId', 'title country')
        .lean(),
      Review.countDocuments(query),
    ]);

    return {
      data: data.map((r: any) => ({
        _id: r._id.toString(),
        user: toUserRef(r.userId),
        destination: r.destinationId
          ? {
              _id: r.destinationId._id.toString(),
              title: r.destinationId.title,
              country: r.destinationId.country,
            }
          : null,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  deleteReview: async (id: string): Promise<void> => {
    const review = await Review.findById(id);
    if (!review) throw new NotFoundError('Review not found');
    const destinationId = review.destinationId.toString();
    await Review.findByIdAndDelete(id);
    await updateDestinationRating(destinationId);
  },

  /* ------------------------------ AI History ---------------------------- */
  listAIHistory: async (
    params: AdminListAIHistoryInput,
  ): Promise<IPaginatedResult<IAdminAIHistory>> => {
    const { page, limit, search, type } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { prompt: { $regex: search, $options: 'i' } },
        { response: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      AIHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email photo')
        .lean(),
      AIHistory.countDocuments(query),
    ]);

    return {
      data: data.map((a: any) => ({
        _id: a._id.toString(),
        user: toUserRef(a.userId),
        type: a.type,
        prompt: a.prompt,
        response: a.response,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
