import { Schema, model } from 'mongoose';
import { ITrip } from './trip.interface';

const tripSchema = new Schema<ITrip>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination ID is required'],
    },
    destination: {
      type: String,
      required: [true, 'Destination name is required'],
    },
    days: {
      type: Number,
      required: [true, 'Days is required'],
      min: [1, 'Days must be at least 1'],
      max: [30, 'Days cannot exceed 30'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be positive'],
    },
    travelStyle: {
      type: String,
      required: [true, 'Travel style is required'],
    },
    interests: [
      {
        type: String,
      },
    ],
    itinerary: {
      type: String,
      required: [true, 'Itinerary is required'],
    },
    estimatedCost: {
      type: Number,
      required: [true, 'Estimated cost is required'],
      min: [0, 'Estimated cost must be positive'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      default: 'saved',
    },
  },
  {
    timestamps: true,
  },
);

tripSchema.index({ userId: 1 });
tripSchema.index({ destinationId: 1 });

export const Trip = model<ITrip>('Trip', tripSchema);
