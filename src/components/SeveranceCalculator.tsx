import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';

export function SeveranceCalculator() {
  const { t, language } = useLanguage();
  const [monthlyGross, setMonthlyGross] = useState<string>('');
  const [years, setYears] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);

  const calculateSeverance = () => {
    const salary = parseFloat(monthlyGross);
    if (isNaN(salary) || salary <= 0) return;

    const cappedYears = Math.min(years, 12);
    setResult(salary * cappedYears);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>{t('severance.title')}</CardTitle>
            <CardDescription>{t('severance.description')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 p-4 rounded-xl border border-border/60 bg-card/50 shadow-sm">
            <Label htmlFor="monthly-salary">{t('severance.monthlySalary')}</Label>
            <Input
              id="monthly-salary"
              type="number"
              value={monthlyGross}
              onChange={(e) => setMonthlyGross(e.target.value)}
              placeholder={language === 'el' ? 'π.χ. 1200' : 'e.g. 1200'}
              className="h-12 text-lg"
            />
            <div className="space-y-2">
              <Label className="flex items-center justify-between text-sm font-medium">
                <span>{t('severance.years')}</span>
                <span className="text-muted-foreground">{years}</span>
              </Label>
              <Slider
                value={[years]}
                min={1}
                max={20}
                step={1}
                onValueChange={([value]) => setYears(value)}
              />
            </div>
            <Button onClick={calculateSeverance} className="w-full" size="lg">
              <ArrowRight className="w-5 h-5 mr-2" />
              {t('severance.estimate')}
            </Button>
            <p className="text-xs text-muted-foreground">{t('severance.note')}</p>
          </div>

          <div className="p-6 rounded-xl border border-border/60 bg-gradient-to-br from-secondary/10 via-background to-background shadow-inner">
            <p className="text-sm text-muted-foreground mb-2">{t('severance.estimate')}</p>
            <h3 className="text-3xl font-display font-bold text-secondary">
              {result ? formatCurrency(result) : '--'}
            </h3>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              {language === 'el'
                ? 'Το ποσό υπολογίζεται με βάση τους μικτούς μισθούς και δεν περιλαμβάνει τυχόν πρόσθετες αποζημιώσεις.'
                : 'Amount estimated on gross salaries and does not include additional compensations.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
