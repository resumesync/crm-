import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import { AuthProvider } from "./contexts/AuthContext";
=======
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
>>>>>>> main
import Pricing from "./pages/Pricing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import OrganizationSettings from "./pages/OrganizationSettings";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Followups from "./pages/Followups";
import Messages from "./pages/Messages";
import Campaigns from "./pages/Campaigns";
import Reviews from "./pages/Reviews";
import Birthdays from "./pages/Birthdays";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
<<<<<<< HEAD
            <Route path="/" element={<Index />} />
=======
            <Route path="/" element={<Landing />} />
>>>>>>> main
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/leads" element={<Leads />} />
<<<<<<< HEAD
=======
            <Route path="/followups" element={<Followups />} />
>>>>>>> main
            <Route path="/messages" element={<Messages />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/birthdays" element={<Birthdays />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/organization" element={<OrganizationSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

