import { Schema, model } from 'mongoose';
import { IDestination } from './destination.interface';

const destinationSchema = new Schema<IDestination>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    gallery: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    estimatedBudget: {
      type: Number,
      required: [true, 'Estimated budget is required'],
      min: [0, 'Budget must be positive'],
    },
    bestSeason: {
      type: String,
      required: [true, 'Best season is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      trim: true,
    },
    bestTimeDescription: {
      type: String,
    },
    highlights: [
      {
        type: String,
      },
    ],
    included: [
      {
        type: String,
      },
    ],
    excluded: [
      {
        type: String,
      },
    ],
    travelTips: [
      {
        type: String,
      },
    ],
    weather: {
      type: String,
    },
    currency: {
      type: String,
    },
    language: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    mapUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

destinationSchema.index({ country: 1 });
destinationSchema.index({ category: 1 });
destinationSchema.index({ rating: 1 });

export const Destination = model<IDestination>('Destination', destinationSchema);
