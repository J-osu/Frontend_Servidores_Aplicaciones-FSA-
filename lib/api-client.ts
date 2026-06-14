// Cliente de API centralizado con manejo de errores
import { AppError, ErrorType } from './errors';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.ferremat.es').replace(/\/$/, '');

interface ApiRequestOptions extends RequestInit {
  baseUrl?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  // Intentar parsear JSON
  let data: any;
  try {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorType = getErrorType(res.status);
    const message = data?.message || data?.error || `HTTP ${res.status}`;

    throw new AppError(
      errorType,
      message,
      res.status,
      new Error(`HTTP ${res.status}`),
      data?.errors || data?.data
    );
  }

  return data;
}

function getErrorType(status: number): ErrorType {
  if (status === 401) return ErrorType.AUTHENTICATION;
  if (status === 403) return ErrorType.AUTHORIZATION;
  if (status === 404) return ErrorType.NOT_FOUND;
  if (status === 409) return ErrorType.CONFLICT;
  if (status === 422 || status === 400) return ErrorType.VALIDATION;
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.UNKNOWN;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { baseUrl = API_URL, ...fetchOptions } = options;

  const url = `${baseUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    return handleResponse<T>(res);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Manejar errores de red
    if (error instanceof TypeError) {
      throw new AppError(
        ErrorType.NETWORK,
        'Error de conexión. Verifica tu conexión a internet.',
        0,
        error
      );
    }

    throw new AppError(
      ErrorType.UNKNOWN,
      'Un error desconocido ocurrió.',
      undefined,
      error
    );
  }
}

export async function apiGet<T = any>(endpoint: string, baseUrl?: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET', baseUrl });
}

export async function apiPost<T = any>(
  endpoint: string,
  data?: any,
  baseUrl?: string
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    baseUrl,
  });
}

export async function apiPut<T = any>(
  endpoint: string,
  data?: any,
  baseUrl?: string
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    baseUrl,
  });
}

export async function apiDelete<T = any>(endpoint: string, baseUrl?: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE', baseUrl });
}
