import { useAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '../types/user';
import type { 
  UpsertUserPayload, 
  UpsertUserResponse, 
  GetUserResponse 
} from '../types/user';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  details?: any;
  
  constructor(
    message: string,
    status: number,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  if (!token) {
    throw new ApiError('Authentication required', 401);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'An error occurred',
      response.status,
      data.details
    );
  }

  return data;
}

/**
 * Hook to get API client with authenticated methods
 */
export function useApiClient() {
  const { getToken } = useAuth();

  return {
    /**
     * Upsert user data in backend
     */
    async upsertUser(payload: UpsertUserPayload): Promise<UpsertUserResponse> {
      const token = await getToken();
      return apiRequest<UpsertUserResponse>('/api/users/upsert', token, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    /**
     * Get current user's profile from backend
     */
    async getMyProfile(): Promise<GetUserResponse> {
      const token = await getToken();
      return apiRequest<GetUserResponse>('/api/users/me', token, {
        method: 'GET',
      });
    },
  };
}
