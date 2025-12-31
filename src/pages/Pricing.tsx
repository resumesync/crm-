import { Button } from '@/components/ui/button';
import { Check, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "₹0",
            period: "forever",
            description: "Perfect for trying out ClientCare",
            features: [
                "50 leads per month",
                "1 user",
                "Basic lead management",
                "Email support",
                "7-day data retention"
            ],
            limitations: [
                "No WhatsApp integration",
                "No analytics",
                "No automations"
            ],
            cta: "Start Free",
            popular: false
        },
        {
            name: "Pro",
            price: "₹3,999",
            period: "per month",
            description: "For growing practices",
            features: [
                "500 leads per month",
                "5 users included",
                "All integrations (Meta, Google, WhatsApp)",
                "Advanced analytics & reports",
                "Workflow automations",
                "Priority email support",
                "Unlimited data retention",
                "Custom fields",
                "Export data (CSV/Excel)",
                "Team collaboration tools"
            ],
            limitations: [],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "pricing",
            description: "For large organizations",
            features: [
                "Unlimited leads",
                "Unlimited users",
                "Everything in Pro, plus:",
                "Dedicated account manager",
                "Custom integrations",
                "API access",
                "White-label options",
                "SLA guarantee",
                "Advanced security",
                "Custom training",
                "Phone & chat support"
            ],
            limitations: [],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Navigation */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold">ClientCare</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <Button variant="ghost">Home</Button>
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
            <section className="container mx-auto px-4 py-16 text-center">
                <h1 className="mb-4 text-5xl font-bold">Simple, Transparent Pricing</h1>
                <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                    Choose the plan that's right for your practice. All plans include a 14-day free trial.
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="container mx-auto px-4 pb-20">
                <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl",
                                plan.popular && "border-primary shadow-lg scale-105 lg:scale-110"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                                        MOST POPULAR
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground">/{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <Link to="/signup" className="mb-6 block">
                                <Button
                                    className="w-full"
                                    variant={plan.popular ? "default" : "outline"}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            <div className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                                {plan.limitations.map((limitation, i) => (
                                    <div key={i} className="flex items-start gap-3 opacity-50">
                                        <Check className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <span className="text-sm line-through">{limitation}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="border-t bg-background py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">Can I switch plans anytime?</h3>
                                <p className="text-muted-foreground">
                                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">What happens after the free trial?</h3>
                                <p className="text-muted-foreground">
                                    After 14 days, you'll be asked to choose a plan. No automatic charges - you decide when to start paying.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">Do you offer refunds?</h3>
                                <p className="text-muted-foreground">
                                    Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment, no questions asked.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">Is my data secure?</h3>
                                <p className="text-muted-foreground">
                                    Absolutely. We use bank-level encryption, regular backups, and comply with all data protection regulations.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-lg font-semibold">Can I cancel anytime?</h3>
                                <p className="text-muted-foreground">
                                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t bg-gradient-to-br from-primary to-purple-600 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Still have questions?</h2>
                    <p className="mb-8 text-lg opacity-90">
                        Our team is here to help you choose the right plan for your practice
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" variant="secondary">
                            Contact Sales
                        </Button>
                        <Link to="/signup">
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2024 ClientCare. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
