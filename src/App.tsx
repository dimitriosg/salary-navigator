import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Yearly from "./pages/Yearly";
import Employer from "./pages/Employer";
import EasterBonus from "./pages/EasterBonus";
import ChristmasBonus from "./pages/ChristmasBonus";
import VacationAllowance from "./pages/VacationAllowance";
import Severance from "./pages/Severance";
import { EmploymentProvider } from "./contexts/EmploymentContext";
import LeaveBalance from "./pages/LeaveBalance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <EmploymentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/yearly" element={<Yearly />} />
                <Route path="/employer" element={<Employer />} />
                <Route path="/easter-bonus" element={<EasterBonus />} />
                <Route path="/christmas-bonus" element={<ChristmasBonus />} />
                <Route path="/vacation-allowance" element={<VacationAllowance />} />
                <Route path="/severance" element={<Severance />} />
                <Route path="/leave-balance" element={<LeaveBalance />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </EmploymentProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
