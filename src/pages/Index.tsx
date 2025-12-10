import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryCalculator } from '@/components/SalaryCalculator';
import { YearlySummary } from '@/components/YearlySummary';
import { ThemeLanguageToggle } from '@/components/ThemeLanguageToggle';
import { RightMenu } from '@/components/RightMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, CalendarDays, Euro } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full gradient-hero py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <ThemeLanguageToggle />
          </div>
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6 shadow-glow">
              <Euro className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              {t('app.title')}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              {t('app.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
          <div>
            <Tabs defaultValue="calculator" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-xl mx-auto mb-8 h-14 p-1 bg-card shadow-card">
            <TabsTrigger
              value="calculator"
              className="gap-2 text-sm data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-12 rounded-lg transition-all"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">{t('tabs.calculator')}</span>
              <span className="sm:hidden">{t('tabs.calculator.short')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="gap-2 text-sm data-[state=active]:gradient-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md h-12 rounded-lg transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">{t('tabs.yearly')}</span>
              <span className="sm:hidden">{t('tabs.yearly')}</span>
            </TabsTrigger>
          </TabsList>

              <div className="animate-slide-up">
                <TabsContent value="calculator" className="mt-0">
                  <SalaryCalculator />
                </TabsContent>

                <TabsContent value="yearly" className="mt-0">
                  <YearlySummary />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <RightMenu />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            {t('footer.disclaimer')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
