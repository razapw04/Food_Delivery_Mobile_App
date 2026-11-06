import {API_BASE_URL, API_TIMEOUT_MS_VALUE} from '../config/api';
import {getSessionToken} from '../storage/authStorage';
import {emitUnauthorized} from './sessionEvents';

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

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    API_TIMEOUT_MS_VALUE,
  );

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onExternalAbort, {once: true});
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    const aborted =
      (error instanceof Error && error.name === 'AbortError') ||
      controller.signal.aborted;
    throw new ApiError(
      aborted
        ? 'Request timed out. Please try again.'
        : 'Cannot reach server. Make sure the backend is running.',
      0,
    );
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onExternalAbort);
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Invalid server response', response.status);
  }

  if (response.status === 401 && !skipAuth) {
    emitUnauthorized();
    throw new ApiError(
      payload?.message || 'Session expired. Please log in again.',
      401,
    );
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message || `Request failed (${response.status})`,
      response.status,
    );
  }

  return payload.data as T;
};
