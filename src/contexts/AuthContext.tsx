import { createContext, useContext, useEffect, useState } from 'react';
import authService from '@/services/authService';
import { toast } from '@/hooks/use-toast';
import type { ApiUser } from '@/types/api';

interface User {
    id: string;
    email: string;
    name?: string;
    role?: 'admin' | 'agent';
}

interface AuthContextType {
    user: ApiUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, password: string, metadata: any) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const DEMO_USER: User = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<ApiUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing auth on mount
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('Failed to get current user:', error);
                    authService.logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const signUp = async (email: string, password: string, metadata: any) => {
        try {
            // Generate username from email
            const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') +
                Math.floor(Math.random() * 1000);

            // Register user
            await authService.register({
                email,
                username,
                password,
                full_name: metadata.fullName
            });

            // Auto-login after registration
            const response = await authService.login({ username, password });
            const userData = (response as any).user || response;
            setUser(userData);

            toast({
                title: "Account created!",
                description: `Welcome, ${metadata.fullName}!`,
            });
        } catch (error: any) {
            toast({
                title: "Sign up failed",
                description: error?.data?.detail || error.message || "Registration failed",
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const response = await authService.login({ username: email, password });
            const userData = (response as any).user || response;
            setUser(userData);

            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error?.data?.detail || error.message || "Invalid credentials",
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = () => {
        authService.logout();
        setUser(null);
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });
    };

    const refreshUser = async () => {
        if (authService.isAuthenticated()) {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to refresh user:', error);
            }
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        refreshUser,
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
