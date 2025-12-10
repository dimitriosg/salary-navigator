import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmployerPage from "./pages/EmployerPage";
import YearlyPage from "./pages/YearlyPage";
import EasterBonusPage from "./pages/EasterBonusPage";
import ChristmasBonusPage from "./pages/ChristmasBonusPage";
import VacationAllowancePage from "./pages/VacationAllowancePage";
import SeverancePage from "./pages/SeverancePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/yearly" element={<YearlyPage />} />
              <Route path="/employer" element={<EmployerPage />} />
              <Route path="/bonus/easter" element={<EasterBonusPage />} />
              <Route path="/bonus/christmas" element={<ChristmasBonusPage />} />
              <Route path="/vacation-allowance" element={<VacationAllowancePage />} />
              <Route path="/severance" element={<SeverancePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
