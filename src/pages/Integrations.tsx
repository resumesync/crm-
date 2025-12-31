import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, ExternalLink, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface IntegrationConfig {
  enabled: boolean;
  connected: boolean;
  lastSync?: string;
}

export default function Integrations() {
  const pageTitle = "Integrations";
  const pageSubtitle = "Connect Meta & Google lead forms";
  const [metaConfig, setMetaConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: true,
    lastSync: "2 hours ago"
  });

  const [googleConfig, setGoogleConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: false
  });

  const [metaForms, setMetaForms] = useState([
    { id: "1", name: "Chemical Peel Inquiry", pageId: "123456789", status: "active", leads: 45 },
    { id: "2", name: "Hair Transplant Consultation", pageId: "123456789", status: "active", leads: 32 },
    { id: "3", name: "Skin Treatment Lead", pageId: "987654321", status: "paused", leads: 18 }
  ]);

  const [googleForms, setGoogleForms] = useState([
    { id: "1", name: "IVF Consultation", campaignId: "CMP-001", status: "active", leads: 28 },
    { id: "2", name: "Gynecology Inquiry", campaignId: "CMP-002", status: "active", leads: 15 }
  ]);

  const webhookUrl = "https://api.abhivrudhi.com/webhooks/leads";

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success("Webhook URL copied to clipboard");
  };

  const handleMetaConnect = () => {
    toast.success("Opening Meta Business Suite...");
    // In production, this would open OAuth flow
  };

  const handleGoogleConnect = () => {
    toast.success("Opening Google Ads connection...");
    // In production, this would open OAuth flow
  };

  const syncLeads = (platform: string) => {
    toast.success(`Syncing ${platform} leads...`);
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageSubtitle}</p>
        </div>
        <Tabs defaultValue="meta" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/>
            </svg>
            Meta Lead Forms
          </TabsTrigger>
          <TabsTrigger value="google" className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google Lead Forms
          </TabsTrigger>
        </TabsList>

        {/* Meta Lead Forms */}
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2]/10">
                    <svg className="h-6 w-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle>Meta Lead Forms</CardTitle>
                    <CardDescription>Connect Facebook & Instagram lead ads</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {metaConfig.connected ? (
                    <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-destructive/50 bg-destructive/10 text-destructive">
                      <XCircle className="mr-1 h-3 w-3" /> Not Connected
                    </Badge>
                  )}
                  <Switch
                    checked={metaConfig.enabled}
                    onCheckedChange={(checked) => setMetaConfig(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!metaConfig.connected ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="mb-4 text-muted-foreground">Connect your Meta Business account to sync leads automatically</p>
                  <Button onClick={handleMetaConnect}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect Meta Business
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Page ID</Label>
                      <Input value="123456789012345" readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Lead Group</Label>
                      <Select defaultValue="chemical-peel">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chemical-peel">Chemical Peel</SelectItem>
                          <SelectItem value="hair-transplant">Hair Transplantation</SelectItem>
                          <SelectItem value="acne">Acne Treatment</SelectItem>
                          <SelectItem value="skin">Skin Brightening</SelectItem>
                          <SelectItem value="ivf">IVF / Gynecology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input value={webhookUrl} readOnly className="bg-muted/50 font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={copyWebhook}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Add this URL to your Meta Lead Ads webhook settings</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Connected Forms</Label>
                      <Button variant="ghost" size="sm" onClick={() => syncLeads("Meta")}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {metaForms.map((form) => (
                        <div key={form.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                          <div>
                            <p className="font-medium">{form.name}</p>
                            <p className="text-sm text-muted-foreground">Page ID: {form.pageId}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={form.status === "active" ? "default" : "secondary"}>
                              {form.leads} leads
                            </Badge>
                            <Badge variant={form.status === "active" ? "outline" : "secondary"}>
                              {form.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Auto-Assignment Rules</CardTitle>
              <CardDescription>Automatically assign leads to team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Assign to</Label>
                  <Select defaultValue="round-robin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="specific">Specific Agent</SelectItem>
                      <SelectItem value="manager">Manager Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Status</Label>
                  <Select defaultValue="new">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Lead</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">Auto-send WhatsApp confirmation</p>
                  <p className="text-sm text-muted-foreground">Send welcome message when lead is captured</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Lead Forms */}
        <TabsContent value="google" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4285F4]/10">
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle>Google Ads Lead Forms</CardTitle>
                    <CardDescription>Connect Google Ads lead form extensions</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {googleConfig.connected ? (
                    <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-destructive/50 bg-destructive/10 text-destructive">
                      <XCircle className="mr-1 h-3 w-3" /> Not Connected
                    </Badge>
                  )}
                  <Switch
                    checked={googleConfig.enabled}
                    onCheckedChange={(checked) => setGoogleConfig(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!googleConfig.connected ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="mb-4 text-muted-foreground">Connect your Google Ads account to sync lead form submissions</p>
                  <Button onClick={handleGoogleConnect}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect Google Ads
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Google Ads Customer ID</Label>
                      <Input value="123-456-7890" readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Lead Group</Label>
                      <Select defaultValue="ivf">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chemical-peel">Chemical Peel</SelectItem>
                          <SelectItem value="hair-transplant">Hair Transplantation</SelectItem>
                          <SelectItem value="acne">Acne Treatment</SelectItem>
                          <SelectItem value="skin">Skin Brightening</SelectItem>
                          <SelectItem value="ivf">IVF / Gynecology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input value={webhookUrl} readOnly className="bg-muted/50 font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={copyWebhook}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Configure this in Google Ads webhook settings</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Connected Campaigns</Label>
                      <Button variant="ghost" size="sm" onClick={() => syncLeads("Google")}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {googleForms.map((form) => (
                        <div key={form.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                          <div>
                            <p className="font-medium">{form.name}</p>
                            <p className="text-sm text-muted-foreground">Campaign: {form.campaignId}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="default">{form.leads} leads</Badge>
                            <Badge variant="outline">{form.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Form Mapping</CardTitle>
              <CardDescription>Map Google form fields to CRM fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { google: "Full Name", crm: "Name" },
                  { google: "Phone Number", crm: "Phone" },
                  { google: "Email Address", crm: "Email" },
                  { google: "City", crm: "City" }
                ].map((mapping, index) => (
                  <div key={index} className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
                    <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
                      {mapping.google}
                    </div>
                    <span className="text-muted-foreground">→</span>
                    <Select defaultValue={mapping.crm.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="clinic">Clinic Name</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}
