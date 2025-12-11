import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Briefcase } from 'lucide-react';

function calculateSeveranceMonths(yearsOfService: number, had17YearsOn20121112: boolean): number {
  const years = Math.max(0, Math.floor(yearsOfService));

  if (had17YearsOn20121112 && years >= 17) {
    const extraMonths = Math.min(12, Math.max(0, years - 16));
    return 12 + extraMonths;
  }

  if (years < 1) return 0;
  if (years < 2) return 2;
  if (years < 4) return 2;
  if (years < 5) return 3;
  if (years < 6) return 3;
  if (years < 8) return 4;
  if (years < 10) return 5;
  if (years === 10) return 6;
  if (years === 11) return 7;
  if (years === 12) return 8;
  if (years === 13) return 9;
  if (years === 14) return 10;
  if (years === 15) return 11;
  return 12;
}

export function SeveranceCalculator() {
  const { t } = useLanguage();
  const [monthlyGross, setMonthlyGross] = useState<string>('');
  const [yearsOfService, setYearsOfService] = useState<number>(1);
  const [had17Years, setHad17Years] = useState<boolean>(false);
  const [result, setResult] = useState<{ gross: number; months: number } | null>(null);

  const handleCalculate = () => {
    const gross = parseFloat(monthlyGross);
    if (isNaN(gross) || gross <= 0) return;

    const monthsAwarded = calculateSeveranceMonths(yearsOfService, had17Years);
    const severanceGross = gross * monthsAwarded;
    setResult({ gross: severanceGross, months: monthsAwarded });
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
            max={40}
            step={1}
            value={yearsOfService}
            onChange={(e) => setYearsOfService(parseFloat(e.target.value) || 0)}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">{t('severance.hint')}</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="font-medium text-sm">{t('severance.had17YearsQuestion')}</p>
            <p className="text-xs text-muted-foreground">{t('severance.had17YearsHint')}</p>
          </div>
          <Switch
            id="had-17-years"
            checked={had17Years}
            onCheckedChange={setHad17Years}
            aria-label={t('severance.had17YearsQuestion')}
          />
        </div>
        <Button className="w-full" size="lg" onClick={handleCalculate}>
          {t('severance.calculate')}
        </Button>

        {result && (
          <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">{t('severance.monthsAwarded')}</p>
                <p className="text-xl font-semibold">{result.months}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/10">
                <p className="text-xs text-muted-foreground">{t('severance.grossAmount')}</p>
                <p className="text-xl font-semibold text-secondary">{formatCurrency(result.gross)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t('severance.disclaimer')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
