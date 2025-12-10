import { PageTemplate } from '@/components/PageTemplate';
import { BonusCalculator } from '@/components/BonusCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

const EasterBonusPage = () => {
  const { t } = useLanguage();

  return (
    <PageTemplate title={t('bonus.easter.title')} subtitle={t('bonus.description')}>
      <BonusCalculator multiplier={0.5} title={t('bonus.easter.title')} description={t('bonus.description')} />
    </PageTemplate>
  );
};

export default EasterBonusPage;
