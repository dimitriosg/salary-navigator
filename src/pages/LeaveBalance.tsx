import { PageLayout } from '@/components/PageLayout';
import { LeaveBalanceCalculator } from '@/components/LeaveBalanceCalculator';
import { CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LeaveBalance = () => {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('leaveBalance.title')}
      subtitle={t('leaveBalance.description')}
      icon={<CalendarCheck className="w-8 h-8 text-primary-foreground" />}
    >
      <LeaveBalanceCalculator />
    </PageLayout>
  );
};

export default LeaveBalance;

