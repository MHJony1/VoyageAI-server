import { Document, Types } from 'mongoose';

export interface IAIHistory extends Document {
  userId: Types.ObjectId;
  type: string;
  prompt: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}
