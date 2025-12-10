import { useEffect, useMemo, useState } from 'react';
import { Gift } from 'lucide-react';

import { useEmployment } from '@/contexts/EmploymentContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { differenceInDaysInclusive, getDaysOverlap } from '@/lib/dateUtils';
import { calculateAnnualLeaveDays } from '@/lib/leaveCalculations';
import { calculateGrossToNet, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const bonusConfig = {
  easter: {
    ratio: 0.5,
    titleKey: 'bonus.easter.title',
    descriptionKey: 'bonus.easter.description',
    disclaimerKey: 'bonus.easter.disclaimer',
  },
  christmas: {
    ratio: 1,
    titleKey: 'bonus.christmas.title',
    descriptionKey: 'bonus.christmas.description',
    disclaimerKey: 'bonus.christmas.disclaimer',
  },
  vacation: {
    ratio: 0.5,
    titleKey: 'bonus.vacation.title',
    descriptionKey: 'bonus.vacation.description',
    disclaimerKey: 'bonus.vacation.disclaimer',
  },
} as const;

interface BonusCalculatorProps {
  type: keyof typeof bonusConfig;
}

type BonusResult =
  | {
      gross: number;
      breakdown: SalaryBreakdown;
      employmentDays: number;
      totalPeriodDays: number;
    }
  | {
      gross: number;
      leaveDays: number;
      payForLeaveDays: number;
    };

export function BonusCalculator({ type }: BonusCalculatorProps) {
  const { t } = useLanguage();
  const { hireDate, setHireDate, weekType, setWeekType } = useEmployment();
  const [monthlyGross, setMonthlyGross] = useState<string>('');
  const [hiredThisYear, setHiredThisYear] = useState<boolean>(false);
  const [result, setResult] = useState<BonusResult | null>(null);

  const { ratio, titleKey, descriptionKey, disclaimerKey } = bonusConfig[type];

  const hireDateValue = useMemo(() => (hireDate ? new Date(hireDate) : null), [hireDate]);
  const today = useMemo(() => new Date(), []);
  const periodLabel = useMemo(() => {
    if (type === 'easter') return t('bonus.easter.period');
    if (type === 'christmas') return t('bonus.christmas.period');
    return '';
  }, [t, type]);

  useEffect(() => {
    if (hireDateValue) {
      setHiredThisYear(hireDateValue.getFullYear() === today.getFullYear());
    }
  }, [hireDateValue, today]);

  const handleCalculate = () => {
    const gross = parseFloat(monthlyGross);
    if (isNaN(gross) || gross <= 0 || !hireDateValue) return;

    if (type === 'vacation') {
      const leaveDays = calculateAnnualLeaveDays(hireDateValue, today, weekType, hiredThisYear);
      const dailyRate = weekType === '6' ? gross / 26 : gross / 25;
      const vacationPay = dailyRate * leaveDays;
      const allowanceGross = Math.min(vacationPay, gross / 2);
      setResult({ gross: allowanceGross, leaveDays, payForLeaveDays: vacationPay });
      return;
    }

    const year = today.getFullYear();
    const periodStart = type === 'easter' ? new Date(year, 0, 1) : new Date(year, 4, 1);
    const periodEnd = type === 'easter' ? new Date(year, 3, 30) : new Date(year, 11, 31);
    const employmentDays = getDaysOverlap(periodStart, periodEnd, hireDateValue);
    const totalPeriodDays = differenceInDaysInclusive(periodStart, periodEnd);
    const ratioWorked = employmentDays / totalPeriodDays;
    const fullBonus = gross * ratio;
    const bonusGross = fullBonus * ratioWorked;
    const breakdown = calculateGrossToNet(bonusGross, 1);
    setResult({ gross: bonusGross, breakdown, employmentDays, totalPeriodDays });
  };

  const renderCommonInputs = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="monthly-gross">{t('bonus.monthlyGross')}</Label>
        <Input
          id="monthly-gross"
          type="number"
          placeholder="1500"
          value={monthlyGross}
          onChange={(e) => setMonthlyGross(e.target.value)}
          className="h-12"
        />
      </div>
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
    </div>
  );

  const renderVacationExtras = () => (
    <div className="space-y-2">
      <Label>{t('bonus.hiredCurrentYearQuestion')}</Label>
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant={hiredThisYear ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setHiredThisYear(true)}
        >
          {t('common.yes')}
        </Button>
        <Button
          type="button"
          variant={!hiredThisYear ? 'default' : 'outline'}
          className="w-full"
          onClick={() => setHiredThisYear(false)}
        >
          {t('common.no')}
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>{t(titleKey)}</CardTitle>
            <CardDescription>{t(descriptionKey)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {renderCommonInputs()}
          {type === 'vacation' && renderVacationExtras()}
          <Button className="w-full" size="lg" onClick={handleCalculate}>
            {t('bonus.calculate')}
          </Button>
          <p className="text-xs text-muted-foreground">{t('bonus.prorationNote')}</p>
        </div>

        {result && type !== 'vacation' && 'employmentDays' in result && (
          <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">{t('bonus.gross')}</p>
                <p className="text-xl font-semibold">{formatCurrency(result.gross)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <p className="text-xs text-muted-foreground">{t('bonus.net')}</p>
                <p className="text-xl font-semibold text-secondary">{formatCurrency(result.breakdown.netSalary)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground flex justify-between">
                  <span>{periodLabel || t('bonus.employmentDays')}</span>
                  <span>{result.employmentDays} / {result.totalPeriodDays}</span>
                </p>
                <p className="text-muted-foreground flex justify-between">
                  <span>{t('calc.efka')}</span>
                  <span>-{formatCurrency(result.breakdown.efkaEmployee)}</span>
                </p>
                <p className="text-muted-foreground flex justify-between">
                  <span>{t('calc.incomeTax')}</span>
                  <span>-{formatCurrency(result.breakdown.incomeTax)}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium flex justify-between">
                  <span>{t('calc.totalDeductions')}</span>
                  <span>-{formatCurrency(result.breakdown.totalDeductions)}</span>
                </p>
                <p className="text-muted-foreground flex justify-between">
                  <span>{t('bonus.grossLabel')}</span>
                  <span>{formatCurrency(result.gross)}</span>
                </p>
                <p className="text-xs text-muted-foreground text-right">{t(disclaimerKey)}</p>
              </div>
            </div>
          </div>
        )}

        {result && type === 'vacation' && 'leaveDays' in result && (
          <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">{t('bonus.vacation.leaveDays')}</p>
                <p className="text-xl font-semibold">{result.leaveDays.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <p className="text-xs text-muted-foreground">{t('bonus.vacation.allowanceGross')}</p>
                <p className="text-xl font-semibold text-secondary">{formatCurrency(result.gross)}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground flex justify-between">
                <span>{t('bonus.vacation.payForDays')}</span>
                <span>{formatCurrency(result.payForLeaveDays)}</span>
              </p>
              <p className="text-xs text-muted-foreground">{t(disclaimerKey)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
