/**
 * Auth Service - API calls for authentication
 */
import api, { setAuthToken, clearAuthToken } from '@/lib/api';
import type {
    ApiUser,
    ApiLoginRequest,
    ApiLoginResponse,
    ApiRegisterRequest,
} from '@/types/api';

export const authService = {
    /**
     * Login user
     */
    login: async (credentials: ApiLoginRequest): Promise<ApiLoginResponse> => {
        const response = await api.post<ApiLoginResponse>('/auth/login', credentials);
        // Backend returns { user, token: { access_token, ... }, message }
        const token = (response as any).token?.access_token || response.access_token;
        if (token) {
            setAuthToken(token);
        }
        return response;
    },

    /**
     * Register new user
     */
    register: async (data: ApiRegisterRequest): Promise<ApiUser> => {
        return api.post<ApiUser>('/auth/register', data);
    },

    /**
     * Get current user
     */
    getCurrentUser: (): Promise<ApiUser> => {
        return api.get<ApiUser>('/auth/me');
    },

    /**
     * Logout user
     */
    logout: (): void => {
        clearAuthToken();
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('auth_token');
    },
};

export default authService;
