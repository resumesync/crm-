import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Users,
    MessageCircle,
    Megaphone,
    Star,
    Zap,
    Shield,
    ArrowRight,
    Check,
    Play,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Users,
        title: 'Lead Management',
        description: 'Capture and organize leads from Meta, Google, and WhatsApp in one place.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
    },
    {
        icon: MessageCircle,
        title: 'WhatsApp Integration',
        description: 'Send personalized messages and campaigns directly through WhatsApp Business API.',
        color: 'text-green-500',
        bg: 'bg-green-500/10'
    },
    {
        icon: Megaphone,
        title: 'Smart Campaigns',
        description: 'Create targeted campaigns with automated follow-ups and scheduling.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
    },
    {
        icon: Zap,
        title: 'Meta Lead Ads',
        description: 'Automatically capture leads from Facebook and Instagram ad campaigns.',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10'
    },
    {
        icon: Star,
        title: 'Review Management',
        description: 'Collect and manage customer reviews to boost your online reputation.',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10'
    },
    {
        icon: Shield,
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security with 99.9% uptime guarantee.',
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10'
    }
];

const testimonials = [
    {
        name: 'Dr. Priya Sharma',
        role: 'Dermatologist, SkinCare Clinic',
        content: 'ClientCare transformed how we manage patient inquiries. Our conversion rate increased by 40%!',
        avatar: 'PS'
    },
    {
        name: 'Rahul Mehta',
        role: 'Owner, Hair Transplant Center',
        content: 'The WhatsApp integration alone saved us 5 hours daily. Highly recommended for healthcare businesses.',
        avatar: 'RM'
    },
    {
        name: 'Dr. Anita Patel',
        role: 'IVF Specialist',
        content: 'Finally a CRM that understands medical practices. The lead tracking is exceptional.',
        avatar: 'AP'
    }
];

const stats = [
    { value: '10,000+', label: 'Leads Managed' },
    { value: '500+', label: 'Happy Clinics' },
    { value: '95%', label: 'Customer Satisfaction' },
    { value: '2M+', label: 'Messages Sent' }
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold">ClientCare</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/10" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                <div className="container mx-auto text-center relative">
                    <Badge className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
                        🎉 New: Meta Lead Ads Integration
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                        Grow Your Clinic with
                        <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Smart Lead Management
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        The all-in-one CRM for healthcare businesses. Capture leads from Meta & Google,
                        engage via WhatsApp, and convert more patients than ever.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link to="/dashboard">
                            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25">
                                Try Demo
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="text-lg px-8">
                            <Play className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4">Features</Badge>
                        <h2 className="text-4xl font-bold mb-4">Everything You Need to Convert Leads</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful tools designed specifically for healthcare practices and clinics.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4">How It Works</Badge>
                        <h2 className="text-4xl font-bold mb-4">Simple 3-Step Process</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center relative">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Connect Your Channels</h3>
                            <p className="text-muted-foreground">Link Meta Lead Ads, WhatsApp, and Google Ads in minutes.</p>
                            <ChevronRight className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <div className="text-center relative">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Capture Leads Automatically</h3>
                            <p className="text-muted-foreground">All inquiries flow into your CRM with full context.</p>
                            <ChevronRight className="hidden md:block absolute top-8 -right-4 h-8 w-8 text-muted-foreground/30" />
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-primary">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Convert & Follow Up</h3>
                            <p className="text-muted-foreground">Engage via WhatsApp and never miss a follow-up.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-4 bg-muted/30">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4">Testimonials</Badge>
                        <h2 className="text-4xl font-bold mb-4">Loved by Healthcare Professionals</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary">{testimonial.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4">Pricing</Badge>
                        <h2 className="text-4xl font-bold mb-4">Start Free, Scale As You Grow</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Starter</h3>
                            <p className="text-muted-foreground mb-4">Perfect for small clinics</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">₹0</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Up to 100 leads</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Basic WhatsApp</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">1 Team Member</span>
                                </li>
                            </ul>
                            <Link to="/dashboard">
                                <Button variant="outline" className="w-full">Try Demo</Button>
                            </Link>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="p-6 border-primary relative">
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Most Popular</Badge>
                            <h3 className="text-xl font-semibold mb-2">Professional</h3>
                            <p className="text-muted-foreground mb-4">For growing practices</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">₹2,999</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Unlimited leads</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Meta Lead Ads</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">WhatsApp Campaigns</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">5 Team Members</span>
                                </li>
                            </ul>
                            <Link to="/dashboard">
                                <Button className="w-full bg-gradient-to-r from-primary to-purple-600">Try Demo</Button>
                            </Link>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                            <p className="text-muted-foreground mb-4">For large organizations</p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">Custom</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Everything in Pro</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Custom integrations</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Dedicated support</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    <span className="text-sm">Unlimited team</span>
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <Card className="p-12 bg-gradient-to-r from-primary to-purple-600 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Practice?</h2>
                            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                                Join 500+ clinics already using ClientCare to grow their patient base.
                            </p>
                            <Link to="/dashboard">
                                <Button size="lg" variant="secondary" className="text-lg px-8">
                                    Try Demo Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-border/50">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <span className="font-semibold">ClientCare</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2024 ClientCare. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
