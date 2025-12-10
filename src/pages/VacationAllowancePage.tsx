import { PageTemplate } from '@/components/PageTemplate';
import { BonusCalculator } from '@/components/BonusCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

const VacationAllowancePage = () => {
  const { t } = useLanguage();

  return (
    <PageTemplate title={t('bonus.vacation.title')} subtitle={t('bonus.description')}>
      <BonusCalculator multiplier={0.5} title={t('bonus.vacation.title')} description={t('bonus.description')} />
    </PageTemplate>
  );
};

export default VacationAllowancePage;
