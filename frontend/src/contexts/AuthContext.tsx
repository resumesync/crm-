import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { clearAuthToken, setAuthToken } from '@/lib/api';
import type { ApiUser } from '@/types/api';
import type { User } from '@/types/crm';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    loginWithFacebook: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Your Facebook App ID - Replace with your actual App ID
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [fbLoaded, setFbLoaded] = useState(false);

    // Load user on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await fetchCurrentUser(token);
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();

        // Load Facebook SDK (keep for Meta integration later)
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            setFbLoaded(true);
        };

        if (!document.getElementById('facebook-jssdk')) {
            const script = document.createElement('script');
            script.id = 'facebook-jssdk';
            script.src = 'https://connect.facebook.net/en_US/sdk.js';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    }, []);

    const fetchCurrentUser = async (token: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch user');

            const data = await response.json();

            const currentUser: User = {
                id: data.id.toString(),
                email: data.email,
                name: data.full_name || data.username,
                role: data.role_name === 'admin' ? 'admin' : 'agent',
                provider: 'email'
            };

            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));
            return currentUser;
        } catch (error) {
            setUser(null);
            throw error;
        }
    };

    const fetchFacebookUser = async (accessToken: string) => {
        try {
            const response = await fetch(
                `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
            );
            const data = await response.json();

            const fbUser: User = {
                id: data.id,
                email: data.email || `${data.id}@facebook.com`,
                name: data.name,
                avatar: data.picture?.data?.url,
                role: 'admin',
                provider: 'facebook'
            };

            setUser(fbUser);
            localStorage.setItem('user', JSON.stringify(fbUser));
            localStorage.setItem('fb_access_token', accessToken);

            toast({
                title: "Welcome!",
                description: `Signed in as ${fbUser.name}`,
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

    const loginWithEmail = async (username: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }

            localStorage.setItem('token', data.token.access_token);

            const loggedInUser: User = {
                id: data.user.id.toString(),
                email: data.user.email,
                name: data.user.full_name || data.user.username,
                role: data.user.role_name === 'admin' ? 'admin' : 'agent',
                provider: 'email'
            };

            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            toast({
                title: "Welcome!",
                description: `Successfully logged in as ${loggedInUser.name}`,
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

    const register = async (userData: any) => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed');
            }

            toast({
                title: "Registration successful!",
                description: "Please login with your credentials.",
            });

            // Automatically login after registration
            await loginWithEmail(userData.username, userData.password);

        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.message || "Registration failed",
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        if (window.FB) {
            try { window.FB.logout(); } catch (e) { }
        }

        setUser(null);
        localStorage.removeItem('token');
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
        loginWithFacebook,
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

