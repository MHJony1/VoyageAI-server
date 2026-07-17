import { Schema, model } from 'mongoose';
import { IAIHistory } from './aiHistory.interface';

const aiHistorySchema = new Schema<IAIHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['planner', 'recommendation', 'chat'],
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
    },
    response: {
      type: String,
      required: [true, 'Response is required'],
    },
  },
  {
    timestamps: true,
  },
);

aiHistorySchema.index({ userId: 1 });

export const AIHistory = model<IAIHistory>('AIHistory', aiHistorySchema);
