import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryCalculator } from '@/components/SalaryCalculator';
import { YearlySummary } from '@/components/YearlySummary';
import { EmployerCostCalculator } from '@/components/EmployerCostCalculator';
import { Calculator, CalendarDays, Euro, Building2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full gradient-hero py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6 shadow-glow">
            <Euro className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            Υπολογιστής Μισθού
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Υπολογίστε τον καθαρό μισθό σας, τις εισφορές σας και προετοιμάστε τη φορολογική σας δήλωση
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto mb-8 h-14 p-1 bg-card shadow-card">
            <TabsTrigger 
              value="calculator" 
              className="gap-2 text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-12 rounded-lg transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Υπολογιστής</span>
              <span className="sm:hidden">Υπολ.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="employer" 
              className="gap-2 text-sm data-[state=active]:gradient-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md h-12 rounded-lg transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Εργοδότης</span>
              <span className="sm:hidden">Εργοδ.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="yearly" 
              className="gap-2 text-sm data-[state=active]:gradient-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md h-12 rounded-lg transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Ετήσια</span>
              <span className="sm:hidden">Ετήσια</span>
            </TabsTrigger>
          </TabsList>

          <div className="animate-slide-up">
            <TabsContent value="calculator" className="mt-0">
              <SalaryCalculator />
            </TabsContent>

            <TabsContent value="employer" className="mt-0">
              <EmployerCostCalculator />
            </TabsContent>

            <TabsContent value="yearly" className="mt-0">
              <YearlySummary />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Οι υπολογισμοί βασίζονται στα φορολογικά δεδομένα του 2024. 
            Για επίσημη χρήση συμβουλευτείτε λογιστή.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
