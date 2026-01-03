import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { clearAuthToken, setAuthToken } from '@/lib/api';
import type { ApiUser } from '@/types/api';

interface AuthContextType {
    user: ApiUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    loginWithEmail: (username: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<ApiUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('Session expired or invalid:', error);
                    clearAuthToken();
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const loginWithEmail = async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.login({ username, password });

            // Extract token and user from response
            const token = (response as any).token?.access_token || response.access_token;
            const userData = (response as any).user || response;

            if (token) {
                setAuthToken(token);
            }

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            toast({
                title: "Welcome!",
                description: `Signed in as ${userData.full_name || userData.username}`,
            });
        } catch (error: any) {
            const errorMessage = error?.data?.detail || error.message || "Invalid credentials";
            toast({
                title: "Login failed",
                description: errorMessage,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, username: string, password: string, fullName?: string) => {
        setLoading(true);
        try {
            await authService.register({ email, username, password, full_name: fullName });

            toast({
                title: "Registration successful!",
                description: "Please login with your credentials.",
            });
        } catch (error: any) {
            const errorMessage = error?.data?.detail || error.message || "Registration failed";
            toast({
                title: "Registration failed",
                description: errorMessage,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        clearAuthToken();
        localStorage.removeItem('user');

        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });

        // Redirect to login page
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        loginWithEmail,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
