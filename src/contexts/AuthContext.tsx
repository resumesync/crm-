import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

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
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    loginWithFacebook: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Your Facebook App ID - Replace with your actual App ID
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [fbLoaded, setFbLoaded] = useState(false);

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

            toast({
                title: "Welcome!",
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

    const logout = () => {
        // Facebook logout
        if (window.FB) {
            window.FB.logout();
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
        loginWithFacebook,
        loginWithEmail,
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
