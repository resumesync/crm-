import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, BarChart3, Users, Zap, Shield, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
    const features = [
        {
            icon: <Users className="h-6 w-6" />,
            title: "Lead Management",
            description: "Capture and organize leads from Meta Ads, Google Ads, and manual sources"
        },
        {
            icon: <MessageCircle className="h-6 w-6" />,
            title: "Multi-Channel Communication",
            description: "WhatsApp, SMS, and Email integration for seamless communication"
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Smart Follow-ups",
            description: "Never miss a follow-up with automated reminders and scheduling"
        },
        {
            icon: <BarChart3 className="h-6 w-6" />,
            title: "Analytics & Reports",
            description: "Track conversion rates, team performance, and campaign ROI"
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "Automation",
            description: "Auto-assign leads, send templates, and streamline workflows"
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Secure & Compliant",
            description: "Enterprise-grade security with data encryption and backups"
        }
    ];

    const testimonials = [
        {
            name: "Dr. Rajesh Kumar",
            role: "Cosmetic Surgeon, Delhi",
            content: "ClientCare has transformed how we handle leads. We've seen a 40% increase in conversions!",
            avatar: "RK"
        },
        {
            name: "Priya Sharma",
            role: "Clinic Manager, Mumbai",
            content: "The WhatsApp integration alone saved us 10 hours per week. Absolutely worth it!",
            avatar: "PS"
        },
        {
            name: "Dr. Anil Mehta",
            role: "Dental Clinic, Bangalore",
            content: "Best CRM for healthcare. Simple, powerful, and actually helps us grow.",
            avatar: "AM"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Navigation */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold">ClientCare</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/pricing">
                            <Button variant="ghost">Pricing</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        🎉 Now with Meta & Google Ads Integration
                    </div>
                    <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
                        The CRM Built for
                        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Healthcare </span>
                        Businesses
                    </h1>
                    <p className="mb-8 text-xl text-muted-foreground">
                        Turn more leads into loyal patients. Automate follow-ups, track conversations, and grow your practice with ClientCare.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link to="/signup">
                            <Button size="lg" className="h-12 px-8">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8">
                            Watch Demo
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        ✨ 14-day free trial • No credit card required • Cancel anytime
                    </p>
                </div>

                {/* Hero Image/Screenshot */}
                <div className="mx-auto mt-16 max-w-5xl">
                    <div className="rounded-xl border bg-card p-2 shadow-2xl">
                        <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <p className="text-lg text-muted-foreground">CRM Dashboard Preview</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-t bg-background py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-bold">Everything You Need to Grow</h2>
                        <p className="text-lg text-muted-foreground">
                            Powerful features designed specifically for healthcare professionals
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="border-t py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-bold">Trusted by Healthcare Professionals</h2>
                        <p className="text-lg text-muted-foreground">
                            Join hundreds of clinics already growing with ClientCare
                        </p>
                    </div>

                    <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="rounded-xl border bg-card p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-t bg-background py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
                        <div className="text-center">
                            <p className="mb-2 text-4xl font-bold text-primary">500+</p>
                            <p className="text-muted-foreground">Active Clinics</p>
                        </div>
                        <div className="text-center">
                            <p className="mb-2 text-4xl font-bold text-primary">50K+</p>
                            <p className="text-muted-foreground">Leads Managed</p>
                        </div>
                        <div className="text-center">
                            <p className="mb-2 text-4xl font-bold text-primary">40%</p>
                            <p className="text-muted-foreground">Avg. Conversion Boost</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t bg-gradient-to-br from-primary to-purple-600 py-20 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-4xl font-bold">Ready to Grow Your Practice?</h2>
                    <p className="mb-8 text-xl opacity-90">
                        Start your 14-day free trial today. No credit card required.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" variant="secondary" className="h-12 px-8">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <BarChart3 className="h-5 w-5" />
                                </div>
                                <span className="text-lg font-bold">ClientCare</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                The CRM built for healthcare professionals
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Product</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="/pricing">Pricing</a></li>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Company</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#">About</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Legal</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#">Privacy</a></li>
                                <li><a href="#">Terms</a></li>
                                <li><a href="#">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                        © 2024 ClientCare. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
