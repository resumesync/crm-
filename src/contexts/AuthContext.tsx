<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from 'react';
import authService from '@/services/authService';
=======
import { createContext, useContext, useState, useEffect } from 'react';
>>>>>>> main
import { toast } from '@/hooks/use-toast';
import type { ApiUser } from '@/types/api';

// Facebook SDK types
declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    role: 'admin' | 'agent';
    provider: 'facebook' | 'email';
}

interface AuthContextType {
    user: ApiUser | null;
    loading: boolean;
    isAuthenticated: boolean;
<<<<<<< HEAD
    signUp: (email: string, password: string, metadata: any) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    refreshUser: () => Promise<void>;
=======
    loginWithFacebook: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => void;
>>>>>>> main
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Your Facebook App ID - Replace with your actual App ID
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

export function AuthProvider({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
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
=======
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [fbLoaded, setFbLoaded] = useState(false);
>>>>>>> main

    // Load Facebook SDK
    useEffect(() => {
        // Check for saved user
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);

        // Load Facebook SDK
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            setFbLoaded(true);

            // Check if already logged in
            window.FB.getLoginStatus((response: any) => {
                if (response.status === 'connected') {
                    fetchFacebookUser(response.authResponse.accessToken);
                }
            });
        };

        // Load SDK script
        if (!document.getElementById('facebook-jssdk')) {
            const script = document.createElement('script');
            script.id = 'facebook-jssdk';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, []);

    const fetchFacebookUser = async (accessToken: string) => {
        try {
<<<<<<< HEAD
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
=======
            const response = await fetch(
                `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
            );
            const data = await response.json();

            const fbUser: User = {
                id: data.id,
                email: data.email || `${data.id}@facebook.com`,
                name: data.name,
                picture: data.picture?.data?.url,
                role: 'admin',
                provider: 'facebook'
            };

            setUser(fbUser);
            localStorage.setItem('user', JSON.stringify(fbUser));
            localStorage.setItem('fb_access_token', accessToken);

            toast({
                title: "Welcome!",
                description: `Signed in as ${fbUser.name}`,
>>>>>>> main
            });

            return fbUser;
        } catch (error) {
            console.error('Error fetching Facebook user:', error);
            throw error;
        }
    };

    const loginWithFacebook = async () => {
        if (!fbLoaded || !window.FB) {
            toast({
                title: "Loading...",
                description: "Facebook SDK is still loading. Please try again.",
                variant: "destructive"
            });
            return;
        }

        return new Promise<void>((resolve, reject) => {
            window.FB.login(async (response: any) => {
                if (response.authResponse) {
                    try {
                        await fetchFacebookUser(response.authResponse.accessToken);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    toast({
                        title: "Login cancelled",
                        description: "Facebook login was cancelled",
                        variant: "destructive"
                    });
                    reject(new Error('Login cancelled'));
                }
            }, { scope: 'email,public_profile,pages_show_list,leads_retrieval' });
        });
    };

    const loginWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
<<<<<<< HEAD
            const response = await authService.login({ username: email, password });
            const userData = (response as any).user || response;
            setUser(userData);
=======
            // Simple email/password auth (replace with your backend)
            if (!email || !password) {
                throw new Error('Email and password required');
            }

            const emailUser: User = {
                id: Date.now().toString(),
                email,
                name: email.split('@')[0],
                role: 'admin',
                provider: 'email'
            };

            setUser(emailUser);
            localStorage.setItem('user', JSON.stringify(emailUser));
>>>>>>> main

            toast({
                title: "Welcome!",
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

<<<<<<< HEAD
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
=======
    const logout = () => {
        // Facebook logout
        if (window.FB) {
            window.FB.logout();
>>>>>>> main
        }

        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('fb_access_token');

        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
<<<<<<< HEAD
        signUp,
        signIn,
        signOut,
        refreshUser,
=======
        loginWithFacebook,
        loginWithEmail,
        logout,
>>>>>>> main
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
