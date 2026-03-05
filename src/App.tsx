import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DocumentScan from "./pages/DocumentScan";
import BudgetTracker from "./pages/BudgetTracker";
import FinancialDashboard from "./pages/FinancialDashboard";
import VoiceAssistant from "./components/VoiceAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scan-document" element={<DocumentScan />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/financial-dashboard" element={<FinancialDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <VoiceAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
