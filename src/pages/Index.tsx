import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalaryCalculator } from '@/components/SalaryCalculator';
import { YearlySummary } from '@/components/YearlySummary';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, CalendarDays, Euro } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const Index = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('app.title')}
      subtitle={t('app.subtitle')}
      icon={<Euro className="w-8 h-8 text-primary-foreground" />}
    >
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
    </PageLayout>
  );
};

export default Index;
