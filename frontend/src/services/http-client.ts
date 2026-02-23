const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

import { logger } from '../utils/logger';

interface HttpClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

/**
 * HTTP Client class for making API requests.
 * Centralizes error handling and request configuration.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config?: Partial<HttpClientConfig>) {
    // Allow explicitly passing an empty string as baseUrl to make requests
    // relative to the current origin (useful when the app is served behind a proxy).
    this.baseUrl = config && config.baseUrl !== undefined ? config.baseUrl : API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config?.defaultHeaders,
    };
  }

  async post<TRequest, TResponse>(
    path: string,
    data: TRequest,
    headers?: Record<string, string>
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<TResponse>(response);
  }

  async get<TResponse>(
    path: string,
    headers?: Record<string, string>
  ): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    });

    return this.handleResponse<TResponse>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.details ?? errorData.error ?? 'Error en la solicitud';
      
      if (errorData.details || errorData.error) {
        logger.error('API error:', message);
      }

      throw new Error(message);
    }

    return response.json();
  }
}

// Default instance for convenience
export const httpClient = new HttpClient();
