import { PageLayout } from '@/components/PageLayout';
import { SeveranceCalculator } from '@/components/SeveranceCalculator';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Severance = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('severance.title')}
      subtitle={t('severance.description')}
      icon={<Briefcase className="w-8 h-8 text-primary-foreground" />}
    >
      <SeveranceCalculator />
    </PageLayout>
  );
};

export default Severance;
