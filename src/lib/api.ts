/**
 * Centralized API client for backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Custom error class for API errors
export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: unknown
    ) {
        super(`API Error: ${status} ${statusText}`);
        this.name = 'ApiError';
    }
}

// Request options type
interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
}

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

// Get auth token from localStorage
function getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
}

// Set auth token
export function setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

// Clear auth token
export function clearAuthToken(): void {
    localStorage.removeItem('auth_token');
}

// Core fetch function
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers: customHeaders, ...restOptions } = options;

    const url = buildUrl(endpoint, params);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    // Add auth header if token exists
    const token = getAuthToken();
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...restOptions,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        // Handle no content response
        if (response.status === 204) {
            return {} as T;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(response.status, response.statusText, data);
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Network error or JSON parse error
        throw new ApiError(0, 'Network Error', { message: (error as Error).message });
    }
}

// HTTP method helpers
export const api = {
    get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return request<T>(endpoint, { method: 'GET', params });
    },

    post<T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return request<T>(endpoint, { method: 'POST', body, params });
    },

    put<T>(endpoint: string, body?: unknown): Promise<T> {
        return request<T>(endpoint, { method: 'PUT', body });
    },

    patch<T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return request<T>(endpoint, { method: 'PATCH', body, params });
    },

    delete<T>(endpoint: string): Promise<T> {
        return request<T>(endpoint, { method: 'DELETE' });
    },
};

export default api;
