import { SalaryCalculator } from '@/components/SalaryCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Euro } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';

const Index = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('app.title')}
      subtitle={t('app.subtitle')}
      icon={<Euro className="w-8 h-8 text-primary-foreground" />}
    >
      <div className="animate-slide-up">
        <SalaryCalculator />
      </div>
    </PageLayout>
  );
};

export default Index;
