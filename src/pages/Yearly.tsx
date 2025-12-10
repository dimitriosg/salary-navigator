import { PageLayout } from '@/components/PageLayout';
import { YearlySummary } from '@/components/YearlySummary';
import { CalendarDays } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Yearly = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('yearly.title')}
      subtitle={t('yearly.description')}
      icon={<CalendarDays className="w-8 h-8 text-primary-foreground" />}
    >
      <YearlySummary />
    </PageLayout>
  );
};

export default Yearly;
