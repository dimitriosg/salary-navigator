import { YearlySummary } from '@/components/YearlySummary';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageTemplate } from '@/components/PageTemplate';

const YearlyPage = () => {
  const { t } = useLanguage();

  return (
    <PageTemplate title={t('yearly.title')} subtitle={t('yearly.description')}>
      <YearlySummary />
    </PageTemplate>
  );
};

export default YearlyPage;
