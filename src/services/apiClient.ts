import {API_BASE_URL} from '../config/api';
import {getSessionToken} from '../storage/authStorage';

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  meta?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  /** Skip Authorization header (login/signup). */
  skipAuth?: boolean;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const {method = 'GET', body, signal, skipAuth = false} = options;
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = await getSessionToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(
      'Cannot reach server. Make sure the backend is running.',
      0,
    );
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Invalid server response', response.status);
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || `Request failed (${response.status})`,
      response.status,
    );
  }

  return payload.data as T;
};
