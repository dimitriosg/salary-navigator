import { PageLayout } from '@/components/PageLayout';
import { BonusCalculator } from '@/components/BonusCalculator';
import { Umbrella } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VacationAllowance = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('bonus.vacation.title')}
      subtitle={t('bonus.vacation.description')}
      icon={<Umbrella className="w-8 h-8 text-primary-foreground" />}
    >
      <BonusCalculator type="vacation" />
    </PageLayout>
  );
};

export default VacationAllowance;
