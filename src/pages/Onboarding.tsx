import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BarChart3, CheckCircle, Building2, Users, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        organizationName: '',
        organizationType: '',
        teamSize: '',
        useCase: '',
        integrations: [] as string[]
    });

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        toast({
            title: "Welcome to ClientCare! 🎉",
            description: "Your account is all set up. Let's start managing leads!",
        });
        navigate('/leads');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
            <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl">
                    {/* Logo & Progress */}
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex items-center justify-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <BarChart3 className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold">ClientCare</span>
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">Let's get you set up</h1>
                        <p className="text-muted-foreground">Step {step} of {totalSteps}</p>
                        <Progress value={progress} className="mt-4" />
                    </div>

                    {/* Step Content */}
                    <div className="rounded-2xl border bg-card p-8 shadow-xl">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">Tell us about your organization</h2>
                                        <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="org-name">Organization Name</Label>
                                        <Input
                                            id="org-name"
                                            placeholder="ABC Medical Center"
                                            value={data.organizationName}
                                            onChange={(e) => setData({ ...data, organizationName: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Type of Practice</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Cosmetic Surgery', 'Dental', 'Hair Transplant', 'Dermatology', 'Wellness', 'Other'].map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setData({ ...data, organizationType: type })}
                                                    className={`rounded-lg border-2 p-3 text-left transition-all ${data.organizationType === type
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <p className="text-sm font-medium">{type}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Team Size</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['1-5', '6-10', '11-25', '25+'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setData({ ...data, teamSize: size })}
                                                    className={`rounded-lg border-2 p-3 text-center transition-all ${data.teamSize === size
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border hover:border-primary/50'
                                                        }`}
                                                >
                                                    <p className="text-sm font-medium">{size}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">How will you use ClientCare?</h2>
                                        <p className="text-sm text-muted-foreground">Select your primary use case</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            value: 'leads',
                                            title: 'Lead Management',
                                            description: 'Track and convert leads from ads and forms'
                                        },
                                        {
                                            value: 'communication',
                                            title: 'Patient Communication',
                                            description: 'WhatsApp, SMS, and email engagement'
                                        },
                                        {
                                            value: 'automation',
                                            title: 'Workflow Automation',
                                            description: 'Auto-assign leads and send follow-ups'
                                        },
                                        {
                                            value: 'analytics',
                                            title: 'Analytics & Reporting',
                                            description: 'Track conversions and team performance'
                                        }
                                    ].map((use) => (
                                        <button
                                            key={use.value}
                                            onClick={() => setData({ ...data, useCase: use.value })}
                                            className={`w-full rounded-lg border-2 p-4 text-left transition-all ${data.useCase === use.value
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <p className="font-medium">{use.title}</p>
                                            <p className="text-sm text-muted-foreground">{use.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                        <Zap className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold">Connect your tools</h2>
                                        <p className="text-sm text-muted-foreground">Optional: Set up integrations now or later</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        {
                                            id: 'meta',
                                            name: 'Meta Ads',
                                            description: 'Import leads from Facebook & Instagram',
                                            icon: '📱'
                                        },
                                        {
                                            id: 'google',
                                            name: 'Google Ads',
                                            description: 'Import leads from Google campaigns',
                                            icon: '🔍'
                                        },
                                        {
                                            id: 'whatsapp',
                                            name: 'WhatsApp Business',
                                            description: 'Send messages directly from CRM',
                                            icon: '💬'
                                        },
                                        {
                                            id: 'email',
                                            name: 'Email (SendGrid)',
                                            description: 'Automated email campaigns',
                                            icon: '📧'
                                        }
                                    ].map((integration) => {
                                        const isSelected = data.integrations.includes(integration.id);
                                        return (
                                            <button
                                                key={integration.id}
                                                onClick={() => {
                                                    setData({
                                                        ...data,
                                                        integrations: isSelected
                                                            ? data.integrations.filter(i => i !== integration.id)
                                                            : [...data.integrations, integration.id]
                                                    });
                                                }}
                                                className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all ${isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 text-left">
                                                    <span className="text-2xl">{integration.icon}</span>
                                                    <div>
                                                        <p className="font-medium">{integration.name}</p>
                                                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle className="h-5 w-5 text-primary" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <p className="text-center text-sm text-muted-foreground">
                                    Don't worry, you can set these up later in Settings
                                </p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-8 flex justify-between">
                            <Button
                                variant="ghost"
                                onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
                            >
                                {step === 1 ? 'Cancel' : 'Back'}
                            </Button>
                            <Button onClick={handleNext}>
                                {step === totalSteps ? 'Complete Setup' : 'Continue'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
