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

  const BACKEND_URL = "http://localhost:8000";

  const [metaConfig, setMetaConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: false,
    lastSync: ""
  });

  const [googleConfig, setGoogleConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: false
  });

  const [whatsappConfig, setWhatsappConfig] = useState<IntegrationConfig>({
    enabled: true,
    connected: false
  });

  // Meta Lead Ads configuration state
  const [metaAccessToken, setMetaAccessToken] = useState("");
  const [metaPageId, setMetaPageId] = useState("");
  const [metaVerifyToken, setMetaVerifyToken] = useState("clientcare_verify_token");
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isTestingMeta, setIsTestingMeta] = useState(false);
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string; pageName?: string } | null>(null);
  const [leadStats, setLeadStats] = useState({ total: 0, today: 0, new: 0 });

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

  const metaWebhookUrl = `${BACKEND_URL}/api/webhook/meta`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Test Meta Lead Ads connection
  const testMetaConnection = async () => {
    if (!metaAccessToken || !metaPageId) {
      toast.error("Please enter Access Token and Page ID");
      return;
    }

    setIsTestingMeta(true);
    setMetaTestResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/meta/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: metaAccessToken,
          page_id: metaPageId
        })
      });

      const data = await response.json();

      if (data.success) {
        setMetaTestResult({
          success: true,
          message: `Connected to: ${data.page_name}`,
          pageName: data.page_name
        });
        setMetaConfig(prev => ({ ...prev, connected: true }));
        toast.success("Meta Lead Ads connected!");
        fetchLeadStats();
      } else {
        setMetaTestResult({ success: false, message: data.error || "Connection failed" });
        toast.error("Connection failed: " + data.error);
      }
    } catch (error) {
      setMetaTestResult({ success: false, message: "Could not reach the backend server" });
      toast.error("Could not connect to backend. Make sure it's running on port 8000.");
    } finally {
      setIsTestingMeta(false);
    }
  };

  // Fetch lead statistics from backend
  const fetchLeadStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stats`);
      const data = await response.json();
      setLeadStats({
        total: data.total_leads || 0,
        today: data.today_leads || 0,
        new: data.new_leads || 0
      });
    } catch (error) {
      console.log("Could not fetch lead stats");
    }
  };

  // Create test lead for demo
  const createTestLead = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/leads/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Lead",
          email: "test@example.com",
          phone: "+91 98765 43210"
        })
      });

      if (response.ok) {
        toast.success("Test lead created! Check the Leads page.");
        fetchLeadStats();
      }
    } catch (error) {
      toast.error("Could not create test lead. Is the backend running?");
    }
  };

  const handleMetaConnect = () => {
    toast.success("Opening Meta Business Suite...");
    window.open("https://business.facebook.com/", "_blank");
  };

  const handleGoogleConnect = () => {
    toast.success("Opening Google Ads connection...");
    window.open("https://ads.google.com/", "_blank");
  };

  const syncLeads = (platform: string) => {
    toast.success(`Syncing ${platform} leads...`);
    fetchLeadStats();
  };

  const testWhatsAppConnection = async () => {
    if (!whatsappAccessToken || !whatsappPhoneNumberId) {
      toast.error("Please enter Access Token and Phone Number ID");
      return;
    }

    setIsTestingConnection(true);
    setTestResult(null);

    // Direct API call to Meta Graph API
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}`,
        {
          headers: {
            "Authorization": `Bearer ${whatsappAccessToken}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.id) {
        setTestResult({
          success: true,
          message: `Connected! Phone: ${data.display_phone_number || 'N/A'}, Name: ${data.verified_name || 'N/A'}`
        });
        setWhatsappConfig(prev => ({ ...prev, connected: true }));
        toast.success("WhatsApp API connected successfully!");
      } else {
        setTestResult({
          success: false,
          message: data.error?.message || "Connection failed"
        });
        toast.error("Connection failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (error) {
      setTestResult({ success: false, message: "Could not reach the WhatsApp API" });
      toast.error("Could not connect to WhatsApp API");
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveWhatsAppConfig = () => {
    // Save to localStorage for persistence
    localStorage.setItem('whatsapp_config', JSON.stringify({
      accessToken: whatsappAccessToken,
      phoneNumberId: whatsappPhoneNumberId,
      businessAccountId: whatsappBusinessAccountId,
      webhookToken: whatsappWebhookToken
    }));
    toast.success("WhatsApp configuration saved to local storage!");
  };

  const sendTestMessage = async () => {
    if (!testPhone) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!whatsappAccessToken || !whatsappPhoneNumberId) {
      toast.error("Please configure WhatsApp API credentials first");
      return;
    }

    setIsSendingTest(true);

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${whatsappAccessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: testPhone.replace(/\D/g, ""),
            type: "text",
            text: { body: testMessage }
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.messages) {
        toast.success("Test message sent successfully!");
      } else {
        toast.error("Failed to send: " + (data.error?.message || "Unknown error"));
      }
    } catch (error) {
      toast.error("Could not send message. Check console for details.");
      console.error("WhatsApp send error:", error);
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
                    <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Meta for Developers</a> and create an app</li>
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
                      <CardTitle>Meta Lead Ads API</CardTitle>
                      <CardDescription>Auto-capture leads from Facebook & Instagram ads</CardDescription>
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
                {/* Setup Instructions */}
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                  <h4 className="font-medium text-blue-600 mb-2">📋 Setup Instructions</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Meta for Developers</a> and create an app</li>
                    <li>Add "Webhooks" product to your app</li>
                    <li>Subscribe to "Page" webhooks with "leadgen" event</li>
                    <li>Get a Page Access Token with leads_retrieval permission</li>
                    <li>Enter your credentials below and test the connection</li>
                  </ol>
                </div>

                {/* Webhook URL */}
                <div className="space-y-2">
                  <Label>Webhook URL (add this to Meta Developer Console)</Label>
                  <div className="flex gap-2">
                    <Input value={metaWebhookUrl} readOnly className="bg-muted/50 font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(metaWebhookUrl, "Webhook URL")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* API Credentials */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="meta-token">Page Access Token *</Label>
                    <div className="relative">
                      <Input
                        id="meta-token"
                        type={showMetaToken ? "text" : "password"}
                        value={metaAccessToken}
                        onChange={(e) => setMetaAccessToken(e.target.value)}
                        placeholder="EAAxxxxxxx..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowMetaToken(!showMetaToken)}
                      >
                        {showMetaToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-page-id">Facebook Page ID *</Label>
                    <Input
                      id="meta-page-id"
                      value={metaPageId}
                      onChange={(e) => setMetaPageId(e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta-verify-token">Webhook Verify Token</Label>
                    <div className="flex gap-2">
                      <Input
                        id="meta-verify-token"
                        value={metaVerifyToken}
                        onChange={(e) => setMetaVerifyToken(e.target.value)}
                        placeholder="clientcare_verify_token"
                      />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(metaVerifyToken, "Verify Token")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Use this token when setting up webhook in Meta</p>
                  </div>
                </div>

                {/* Test Result */}
                {metaTestResult && (
                  <div className={`rounded-lg p-3 ${metaTestResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <div className="flex items-center gap-2">
                      {metaTestResult.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={metaTestResult.success ? 'text-green-600' : 'text-red-600'}>
                        {metaTestResult.message}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={testMetaConnection} disabled={isTestingMeta}>
                    {isTestingMeta ? (
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
                  <Button variant="outline" onClick={createTestLead}>
                    Create Test Lead
                  </Button>
                  <Button variant="ghost" onClick={handleMetaConnect}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Meta Business
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lead Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lead Statistics</CardTitle>
                <CardDescription>Leads captured from Meta Lead Ads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-primary">{leadStats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-green-600">{leadStats.today}</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-3xl font-bold text-blue-600">{leadStats.new}</p>
                    <p className="text-sm text-muted-foreground">New</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => syncLeads("Meta")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Stats
                </Button>
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
      </div >
    </Layout >
  );
}
