import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEmployment } from '@/contexts/EmploymentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateAnnualLeaveDays } from '@/lib/leaveCalculations';

export function LeaveBalanceCalculator() {
  const { t } = useLanguage();
  const { hireDate, setHireDate, weekType, setWeekType } = useEmployment();
  const [currentYear, setCurrentYear] = useState<string>(new Date().getFullYear().toString());
  const [takenDays, setTakenDays] = useState<string>('0');

  const hireDateValue = useMemo(() => (hireDate ? new Date(hireDate) : null), [hireDate]);
  const asOfDate = useMemo(() => new Date(Number(currentYear), 11, 31), [currentYear]);

  const entitlement = useMemo(() => {
    if (!hireDateValue || isNaN(asOfDate.getTime())) return 0;
    return calculateAnnualLeaveDays(hireDateValue, asOfDate, weekType, true);
  }, [asOfDate, hireDateValue, weekType]);

  const taken = Math.max(0, parseFloat(takenDays) || 0);
  const remaining = Math.max(entitlement - taken, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('leaveBalance.title')}</CardTitle>
        <CardDescription>{t('leaveBalance.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hire-date">{t('bonus.hireDate')}</Label>
            <Input
              id="hire-date"
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="current-year">{t('leaveBalance.currentYear')}</Label>
            <Input
              id="current-year"
              type="number"
              min="1900"
              max="3000"
              value={currentYear}
              onChange={(e) => setCurrentYear(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('bonus.weekType')}</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={weekType === '5' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setWeekType('5')}
              >
                {t('bonus.weekType5')}
              </Button>
              <Button
                type="button"
                variant={weekType === '6' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setWeekType('6')}
              >
                {t('bonus.weekType6')}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taken-days">{t('leaveBalance.takenDays')}</Label>
            <Input
              id="taken-days"
              type="number"
              min="0"
              value={takenDays}
              onChange={(e) => setTakenDays(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground">{t('leaveBalance.entitled')}</p>
            <p className="text-2xl font-semibold">{entitlement.toFixed(2)} {t('leaveBalance.days')}</p>
            <p className="text-xs text-muted-foreground">
              {t('leaveBalance.entitled')} {asOfDate.getFullYear()}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/10 border border-border">
            <p className="text-xs text-muted-foreground">{t('leaveBalance.used')}</p>
            <p className="text-2xl font-semibold text-secondary">{taken.toFixed(2)} {t('leaveBalance.days')}</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/10 border border-border">
            <p className="text-xs text-muted-foreground">{t('leaveBalance.remaining')}</p>
            <p className="text-2xl font-semibold text-primary">{remaining.toFixed(2)} {t('leaveBalance.days')}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{t('leaveBalance.disclaimer')}</p>
      </CardContent>
    </Card>
  );
}

