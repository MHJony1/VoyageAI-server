import { Schema, model } from 'mongoose';
import { IConversation } from './conversation.interface';

const messageSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['user', 'assistant'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({ userId: 1 });

export const Conversation = model<IConversation>('Conversation', conversationSchema);
