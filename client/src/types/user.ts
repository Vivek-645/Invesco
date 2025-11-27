// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// User Types
export interface User {
  _id: string;
  clerkId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  phone: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  lastSeen: string;
}

export interface UpsertUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export interface UpsertUserResponse {
  success: boolean;
  data: {
    user: User;
    isNewUser: boolean;
  };
  error?: string;
}

export interface GetUserResponse {
  success: boolean;
  data: {
    user: User;
  };
  error?: string;
}
