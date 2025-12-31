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
import { CheckCircle2, XCircle, ExternalLink, Copy, RefreshCw, MessageCircle, Send, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface IntegrationConfig {
  enabled: boolean;
  connected: boolean;
  lastSync?: string;
}

export default function Integrations() {
  const pageTitle = "Integrations";
  const pageSubtitle = "Connect Meta, Google & WhatsApp APIs";

  const [metaConfig, setMetaConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: true,
    lastSync: "2 hours ago"
  });

  const [googleConfig, setGoogleConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: false
  });

  const [whatsappConfig, setWhatsappConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: false
  });

  // WhatsApp configuration state
  const [whatsappAccessToken, setWhatsappAccessToken] = useState("");
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState("");
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState("");
  const [whatsappWebhookToken, setWhatsappWebhookToken] = useState("");
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Test message state
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Hello! This is a test message from ClientCare CRM.");
  const [isSendingTest, setIsSendingTest] = useState(false);

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
  const whatsappWebhookUrl = `${window.location.origin.replace(':8080', ':8000')}/api/v1/whatsapp/webhook`;

  const copyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Webhook URL copied to clipboard");
  };

  const handleMetaConnect = () => {
    toast.success("Opening Meta Business Suite...");
  };

  const handleGoogleConnect = () => {
    toast.success("Opening Google Ads connection...");
  };

  const syncLeads = (platform: string) => {
    toast.success(`Syncing ${platform} leads...`);
  };

  const testWhatsAppConnection = async () => {
    if (!whatsappAccessToken || !whatsappPhoneNumberId) {
      toast.error("Please enter Access Token and Phone Number ID");
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/v1/whatsapp/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: whatsappAccessToken,
          phone_number_id: whatsappPhoneNumberId
        })
      });

      const data = await response.json();

      if (data.success) {
        setTestResult({
          success: true,
          message: `Connected! Phone: ${data.phone_number}, Name: ${data.verified_name}`
        });
        setWhatsappConfig(prev => ({ ...prev, connected: true }));
        toast.success("WhatsApp API connected successfully!");
      } else {
        setTestResult({
          success: false,
          message: data.error || "Connection failed"
        });
        toast.error("Connection failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setTestResult({ success: false, message: "Could not reach the server" });
      toast.error("Could not connect to the backend server");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveWhatsAppConfig = () => {
    // In production, this would save to backend/database
    toast.success("WhatsApp configuration saved! Please update your .env file with these credentials.");
    console.log("Save these to .env:", {
      WHATSAPP_ACCESS_TOKEN: whatsappAccessToken,
      WHATSAPP_PHONE_NUMBER_ID: whatsappPhoneNumberId,
      WHATSAPP_BUSINESS_ACCOUNT_ID: whatsappBusinessAccountId,
      WHATSAPP_WEBHOOK_VERIFY_TOKEN: whatsappWebhookToken
    });
  };

  const sendTestMessage = async () => {
    if (!testPhone) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsSendingTest(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: testPhone.replace(/\D/g, ""), // Remove non-digits
          message: testMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Test message sent successfully!");
      } else {
        toast.error("Failed to send: " + (data.error || data.detail || "Unknown error"));
      }
    } catch (error) {
      toast.error("Could not send message. Make sure backend is running.");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageSubtitle}</p>
        </div>
        <Tabs defaultValue="whatsapp" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
              </svg>
              Meta Leads
            </TabsTrigger>
            <TabsTrigger value="google" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google Leads
            </TabsTrigger>
          </TabsList>

          {/* WhatsApp Business API */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10">
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div>
                      <CardTitle>WhatsApp Business API</CardTitle>
                      <CardDescription>Connect Meta Cloud API for WhatsApp messaging</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {whatsappConfig.connected ? (
                      <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-destructive/50 bg-destructive/10 text-destructive">
                        <XCircle className="mr-1 h-3 w-3" /> Not Connected
                      </Badge>
                    )}
                    <Switch
                      checked={whatsappConfig.enabled}
                      onCheckedChange={(checked) => setWhatsappConfig(prev => ({ ...prev, enabled: checked }))}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Setup Instructions */}
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                  <h4 className="font-medium text-blue-600 mb-2">📋 Setup Instructions</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://developers.facebook.com" target="_blank" className="text-blue-500 hover:underline">Meta for Developers</a> and create an app</li>
                    <li>Add "WhatsApp" product to your app</li>
                    <li>Get your Access Token from the API Setup page</li>
                    <li>Copy your Phone Number ID from the same page</li>
                    <li>Enter the credentials below and test the connection</li>
                  </ol>
                </div>

                {/* API Credentials */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="access-token">Access Token *</Label>
                    <div className="relative">
                      <Input
                        id="access-token"
                        type={showAccessToken ? "text" : "password"}
                        value={whatsappAccessToken}
                        onChange={(e) => setWhatsappAccessToken(e.target.value)}
                        placeholder="EAAxxxxxxx..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowAccessToken(!showAccessToken)}
                      >
                        {showAccessToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-number-id">Phone Number ID *</Label>
                    <Input
                      id="phone-number-id"
                      value={whatsappPhoneNumberId}
                      onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                      placeholder="1234567890123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-account-id">Business Account ID (Optional)</Label>
                    <Input
                      id="business-account-id"
                      value={whatsappBusinessAccountId}
                      onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
                      placeholder="For template management"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-token">Webhook Verify Token</Label>
                    <Input
                      id="webhook-token"
                      value={whatsappWebhookToken}
                      onChange={(e) => setWhatsappWebhookToken(e.target.value)}
                      placeholder="Your custom verify token"
                    />
                  </div>
                </div>

                {/* Test Result */}
                {testResult && (
                  <div className={`rounded-lg p-3 ${testResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <div className="flex items-center gap-2">
                      {testResult.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                        {testResult.message}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={testWhatsAppConnection} disabled={isTestingConnection}>
                    {isTestingConnection ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={saveWhatsAppConfig}>
                    Save Configuration
                  </Button>
                </div>

                {/* Webhook URL */}
                <div className="space-y-2">
                  <Label>Webhook URL (for receiving messages)</Label>
                  <div className="flex gap-2">
                    <Input value={whatsappWebhookUrl} readOnly className="bg-muted/50 font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => copyWebhook(whatsappWebhookUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Add this URL in Meta Developer Console → WhatsApp → Configuration → Webhook</p>
                </div>
              </CardContent>
            </Card>

            {/* Test Message Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Send Test Message</CardTitle>
                <CardDescription>Test your WhatsApp integration by sending a message</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="test-phone">Phone Number (with country code)</Label>
                    <Input
                      id="test-phone"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="919876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-message">Message</Label>
                    <Input
                      id="test-message"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Your test message"
                    />
                  </div>
                </div>
                <Button onClick={sendTestMessage} disabled={isSendingTest || !whatsappConfig.connected}>
                  {isSendingTest ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Test Message
                    </>
                  )}
                </Button>
                {!whatsappConfig.connected && (
                  <p className="text-sm text-muted-foreground">Connect WhatsApp API first to send test messages</p>
                )}
              </CardContent>
            </Card>

            {/* Environment Variables Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Environment Variables</CardTitle>
                <CardDescription>Add these to your backend .env file</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-muted p-4 text-sm font-mono overflow-x-auto">
                  {`# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=${whatsappAccessToken || "your_access_token_here"}
WHATSAPP_PHONE_NUMBER_ID=${whatsappPhoneNumberId || "your_phone_number_id_here"}
WHATSAPP_BUSINESS_ACCOUNT_ID=${whatsappBusinessAccountId || "your_business_account_id_here"}
WHATSAPP_WEBHOOK_VERIFY_TOKEN=${whatsappWebhookToken || "your_custom_verify_token"}`}
                </pre>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => {
                  navigator.clipboard.writeText(`WHATSAPP_ACCESS_TOKEN=${whatsappAccessToken}\nWHATSAPP_PHONE_NUMBER_ID=${whatsappPhoneNumberId}\nWHATSAPP_BUSINESS_ACCOUNT_ID=${whatsappBusinessAccountId}\nWHATSAPP_WEBHOOK_VERIFY_TOKEN=${whatsappWebhookToken}`);
                  toast.success("Environment variables copied!");
                }}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meta Lead Forms */}
          <TabsContent value="meta" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2]/10">
                      <svg className="h-6 w-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
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
                        <Button variant="outline" size="icon" onClick={() => copyWebhook(webhookUrl)}>
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
          </TabsContent>

          {/* Google Lead Forms */}
          <TabsContent value="google" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4285F4]/10">
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <p className="mb-4 text-muted-foreground">Connect your Google Ads account to sync lead form submissions</p>
                  <Button onClick={handleGoogleConnect}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect Google Ads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
