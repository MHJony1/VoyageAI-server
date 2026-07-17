/**
 * Conversation Module - Type Definitions
 */

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface IConversationResponse {
  _id: string;
  userId: string;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface IChatRequest {
  message: string;
  conversationId?: string;
}

export interface IChatResponse {
  conversationId: string;
  message: string;
  messages: IMessage[];
}
