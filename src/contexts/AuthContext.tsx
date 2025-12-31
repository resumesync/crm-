import { createContext, useContext, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
    id: string;
    email: string;
    name?: string;
    role?: 'admin' | 'agent';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, password: string, metadata: any) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
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
    const [user, setUser] = useState<User | null>(DEMO_USER); // Auto-login for demo
    const [loading, setLoading] = useState(false);

    const signUp = async (email: string, password: string, metadata: any) => {
        try {
            setLoading(true);
            // Simulate signup - in production, connect to your auth provider
            const newUser: User = {
                id: Date.now().toString(),
                email,
                name: metadata.name || email.split('@')[0],
                role: 'admin'
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

            toast({
                title: "Account created!",
                description: "Welcome to ClientCare CRM.",
            });
        } catch (error: any) {
            toast({
                title: "Sign up failed",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            // Simulate login - in production, connect to your auth provider
            const loggedInUser: User = {
                id: '1',
                email,
                name: email.split('@')[0],
                role: 'admin'
            };
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
        } catch (error: any) {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
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
