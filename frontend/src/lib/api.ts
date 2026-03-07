const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const TOKEN_KEY = 'token';

export const setAuthToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
    constructor(public message: string, public status?: number, public data?: any) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}${endpoint.startsWith('/api') ? '' : '/api'}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new ApiError(errorData.detail || `Request failed with status ${response.status}`, response.status, errorData);
    }

    return response.json();
}

const api = {
    get: <T = any>(endpoint: string, params?: Record<string, any>) => {
        const url = params
            ? `${endpoint}?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))}`
            : endpoint;
        return apiFetch<T>(url, { method: 'GET' });
    },
    post: <T = any>(endpoint: string, body?: any, params?: Record<string, any>) => {
        const url = params
            ? `${endpoint}?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))}`
            : endpoint;
        return apiFetch<T>(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    },
    put: <T = any>(endpoint: string, body?: any) => apiFetch<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    }),
    patch: <T = any>(endpoint: string, body?: any, params?: Record<string, any>) => {
        const url = params
            ? `${endpoint}?${new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))}`
            : endpoint;
        return apiFetch<T>(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    },
    delete: <T = any>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};

export default api;
