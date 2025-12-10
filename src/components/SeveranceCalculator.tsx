import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateGrossToNet, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Briefcase } from 'lucide-react';

export function SeveranceCalculator() {
  const { t } = useLanguage();
  const [monthlyGross, setMonthlyGross] = useState<string>('');
  const [yearsOfService, setYearsOfService] = useState<number>(1);
  const [result, setResult] = useState<{ gross: number; breakdown: SalaryBreakdown } | null>(null);

  const handleCalculate = () => {
    const gross = parseFloat(monthlyGross);
    if (isNaN(gross) || gross <= 0) return;

    const monthsAwarded = Math.max(1, yearsOfService * 0.5);
    const severanceGross = gross * monthsAwarded;
    const breakdown = calculateGrossToNet(severanceGross, 1);
    setResult({ gross: severanceGross, breakdown });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>{t('severance.title')}</CardTitle>
            <CardDescription>{t('severance.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="severance-gross">{t('severance.monthlyGross')}</Label>
          <Input
            id="severance-gross"
            type="number"
            placeholder="1500"
            value={monthlyGross}
            onChange={(e) => setMonthlyGross(e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years">{t('severance.years')}</Label>
          <Input
            id="years"
            type="number"
            min={0}
            max={35}
            step={0.5}
            value={yearsOfService}
            onChange={(e) => setYearsOfService(parseFloat(e.target.value) || 0)}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">{t('severance.hint')}</p>
        </div>
        <Button className="w-full" size="lg" onClick={handleCalculate}>
          {t('severance.calculate')}
        </Button>

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
                <p className="text-xs text-muted-foreground text-right">{t('severance.note')}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
