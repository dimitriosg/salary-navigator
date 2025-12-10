import { EmployerCostCalculator } from '@/components/EmployerCostCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTemplate } from '@/components/PageTemplate';

const EmployerPage = () => {
  const { t } = useLanguage();

  return (
    <PageTemplate title={t('employer.title')} subtitle={t('employer.description')}>
      <EmployerCostCalculator />
    </PageTemplate>
  );
};

export default EmployerPage;
