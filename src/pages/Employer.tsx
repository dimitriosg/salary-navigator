import { PageLayout } from '@/components/PageLayout';
import { EmployerCostCalculator } from '@/components/EmployerCostCalculator';
import { Landmark } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Employer = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('employer.title')}
      subtitle={t('employer.description')}
      icon={<Landmark className="w-8 h-8 text-primary-foreground" />}
    >
      <EmployerCostCalculator />
    </PageLayout>
  );
};

export default Employer;
