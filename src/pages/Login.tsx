import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { loginWithFacebook, loginWithEmail } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFacebookLoading, setIsFacebookLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await loginWithEmail(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            // Error handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsFacebookLoading(true);
        try {
            await loginWithFacebook();
            navigate('/');
        } catch (error) {
            // Error handled in AuthContext
        } finally {
            setIsFacebookLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
            <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link to="/" className="mb-8 flex items-center justify-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold">ClientCare</span>
                    </Link>

                    {/* Card */}
                    <div className="rounded-2xl border bg-card p-8 shadow-xl">
                        <div className="mb-6 text-center">
                            <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
                            <p className="text-sm text-muted-foreground">
                                Log in to your ClientCare account
                            </p>
                        </div>

                        {/* Facebook Login Button - Primary */}
                        <Button
                            onClick={handleFacebookLogin}
                            disabled={isFacebookLoading}
                            className="w-full mb-4 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
                            size="lg"
                        >
                            {isFacebookLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
                                </svg>
                            )}
                            {isFacebookLoading ? 'Connecting...' : 'Continue with Facebook'}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                variant="outline"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Log in with Email'
                                )}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-primary hover:underline">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    {/* Facebook Required Notice */}
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                        By continuing with Facebook, you allow access to your profile and pages for lead management.
                    </p>
                </div>
            </div>
        </div>
    );
}
