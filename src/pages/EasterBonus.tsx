import { PageLayout } from '@/components/PageLayout';
import { BonusCalculator } from '@/components/BonusCalculator';
import { Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const EasterBonus = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('bonus.easter.title')}
      subtitle={t('bonus.easter.description')}
      icon={<Gift className="w-8 h-8 text-primary-foreground" />}
    >
      <BonusCalculator type="easter" />
    </PageLayout>
  );
};

export default EasterBonus;
