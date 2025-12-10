import { PageLayout } from '@/components/PageLayout';
import { BonusCalculator } from '@/components/BonusCalculator';
import { Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ChristmasBonus = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('bonus.christmas.title')}
      subtitle={t('bonus.christmas.description')}
      icon={<Gift className="w-8 h-8 text-primary-foreground" />}
    >
      <BonusCalculator type="christmas" />
    </PageLayout>
  );
};

export default ChristmasBonus;
