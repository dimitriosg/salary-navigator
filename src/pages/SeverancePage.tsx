import { PageTemplate } from '@/components/PageTemplate';
import { SeveranceCalculator } from '@/components/SeveranceCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

const SeverancePage = () => {
  const { t } = useLanguage();

  return (
    <PageTemplate title={t('severance.title')} subtitle={t('severance.description')}>
      <SeveranceCalculator />
    </PageTemplate>
  );
};

export default SeverancePage;
