import { Trip } from '../../models/trip.model';
import { AIHistory } from '../../models/aiHistory.model';
import { Review } from '../../models/review.model';

/**
 * Dashboard Service
 * Provides aggregated statistics and overview data
 */

export const dashboardService = {
  /**
   * Get dashboard overview
   */
  getOverview: async (userId: string) => {
    const { Types } = require('mongoose');
    const userObjectId = new Types.ObjectId(userId);

    // Get counts
    const tripCount = await Trip.countDocuments({ userId });
    const aiCount = await AIHistory.countDocuments({ userId });
    const reviewCount = await Review.countDocuments({ userId });

    // Get favorite destination category from recent trips
    const recentTrips = await Trip.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const favoriteCategory = await Trip.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    // Get recent AI activities
    const recentAI = await AIHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      totalTrips: tripCount,
      totalAIGenerations: aiCount,
      totalReviews: reviewCount,
      favoriteDestination: favoriteCategory.length > 0 ? favoriteCategory[0]._id : null,
      recentTrips: recentTrips.map((trip: any) => ({
        _id: trip._id.toString(),
        destination: trip.destination,
        days: trip.days,
        budget: trip.budget,
        createdAt: trip.createdAt,
      })),
      recentAIActivities: recentAI.map((activity: any) => ({
        _id: activity._id.toString(),
        type: activity.type,
        createdAt: activity.createdAt,
      })),
    };
  },

  /**
   * Get dashboard statistics
   */
  getStatistics: async (userId: string) => {
    // Convert userId to ObjectId format for aggregation
    const { Types } = require('mongoose');
    const userObjectId = new Types.ObjectId(userId);

    // Monthly trip count
    const monthlyTrips = await Trip.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Monthly AI usage
    const monthlyAI = await AIHistory.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Monthly reviews
    const monthlyReviews = await Review.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Trip status distribution
    const tripStatus = await Trip.aggregate([
      {
        $match: { userId: userObjectId },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      monthlyTrips: monthlyTrips.map((m: any) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        count: m.count,
      })),
      monthlyAI: monthlyAI.map((m: any) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        count: m.count,
      })),
      monthlyReviews: monthlyReviews.map((m: any) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        count: m.count,
      })),
      tripStatusDistribution: tripStatus.map((s: any) => ({
        status: s._id,
        count: s.count,
      })),
    };
  },
};
