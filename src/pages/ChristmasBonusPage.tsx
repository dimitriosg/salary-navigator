import { PageTemplate } from '@/components/PageTemplate';
import { BonusCalculator } from '@/components/BonusCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

const ChristmasBonusPage = () => {
  const { t } = useLanguage();

  return (
    <PageTemplate title={t('bonus.christmas.title')} subtitle={t('bonus.description')}>
      <BonusCalculator multiplier={1} title={t('bonus.christmas.title')} description={t('bonus.description')} />
    </PageTemplate>
  );
};

export default ChristmasBonusPage;
