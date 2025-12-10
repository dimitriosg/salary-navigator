import { useEffect, useMemo, useState } from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateGrossToNet, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift } from 'lucide-react';
import { useEmployment } from '@/contexts/EmploymentContext';
import { calculateAnnualLeaveDays } from '@/lib/leaveCalculations';
import { differenceInDaysInclusive, getDaysOverlap } from '@/lib/dateUtils';

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
import { Slider } from '@/components/ui/slider';
import { calculateGrossToNet, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift } from 'lucide-react';

const bonusConfig = {
  easter: { ratio: 0.5, titleKey: 'bonus.easter.title', descriptionKey: 'bonus.easter.description' },
  christmas: { ratio: 1, titleKey: 'bonus.christmas.title', descriptionKey: 'bonus.christmas.description' },
  vacation: { ratio: 0.5, titleKey: 'bonus.vacation.title', descriptionKey: 'bonus.vacation.description' },
} as const;

interface BonusCalculatorProps {
  type: keyof typeof bonusConfig;
}

export function BonusCalculator({ type }: BonusCalculatorProps) {
  const { t } = useLanguage();
  const [monthlyGross, setMonthlyGross] = useState<string>('');
  const [monthsWorked, setMonthsWorked] = useState<number>(12);
  const [result, setResult] = useState<{ gross: number; breakdown: SalaryBreakdown } | null>(null);

  const { ratio, titleKey, descriptionKey } = bonusConfig[type];

  const handleCalculate = () => {
    const gross = parseFloat(monthlyGross);
    if (isNaN(gross) || gross <= 0) return;

    const bonusGross = gross * ratio * (monthsWorked / 12);
    const breakdown = calculateGrossToNet(bonusGross, 1);
    setResult({ gross: bonusGross, breakdown });
  };

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
            <div className="flex items-center justify-between text-sm">
              <Label>{t('bonus.monthsWorked')}</Label>
              <span className="text-muted-foreground">{monthsWorked} / 12</span>
            </div>
            <Slider
              value={[monthsWorked]}
              onValueChange={([val]) => setMonthsWorked(val)}
              min={1}
              max={12}
              step={1}
            />
            <p className="text-xs text-muted-foreground">{t('bonus.monthsHint')}</p>
          </div>
          <Button className="w-full" size="lg" onClick={handleCalculate}>
            {t('bonus.calculate')}
          </Button>
        </div>

        {result && (
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
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
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
                <p className="text-xs text-muted-foreground text-right">{t('bonus.note')}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
