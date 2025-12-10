import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Sparkles, ArrowRightLeft } from 'lucide-react';
import { calculateGrossToNet, calculateNetToGross, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';

interface BonusCalculatorProps {
  multiplier: number;
  title: string;
  description: string;
}

export function BonusCalculator({ multiplier, title, description }: BonusCalculatorProps) {
  const { t, language } = useLanguage();
  const [monthlyGross, setMonthlyGross] = useState<string>('');
  const [bonusNetTarget, setBonusNetTarget] = useState<string>('');
  const [children, setChildren] = useState<number>(0);
  const [grossToNetResult, setGrossToNetResult] = useState<SalaryBreakdown | null>(null);
  const [netToGrossResult, setNetToGrossResult] = useState<SalaryBreakdown | null>(null);

  const handleGrossToNet = () => {
    const baseGross = parseFloat(monthlyGross);
    if (isNaN(baseGross) || baseGross <= 0) return;

    const bonusGross = baseGross * multiplier;
    setGrossToNetResult(calculateGrossToNet(bonusGross, 1, children));
  };

  const handleNetToGross = () => {
    const targetNet = parseFloat(bonusNetTarget);
    if (isNaN(targetNet) || targetNet <= 0) return;

    setNetToGrossResult(calculateNetToGross(targetNet, 1, children));
  };

  const getChildrenLabel = (num: number) => {
    if (num === 0) return language === 'el' ? 'Χωρίς' : 'None';
    return `${num}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3 items-start">
          <div className="md:col-span-1 space-y-3 p-4 bg-muted/40 rounded-xl border border-border/50">
            <Label htmlFor="children" className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4" />
              {t('bonus.children')}
            </Label>
            <select
              id="children"
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value))}
              className="w-full h-11 px-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <option key={num} value={num}>
                  {getChildrenLabel(num)}
                </option>
              ))}
            </select>
            <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
              <p>
                {t('bonus.multiplier')}: <span className="font-semibold text-foreground">x{multiplier.toFixed(2)}</span>
              </p>
              <p>{t('bonus.note')}</p>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl border border-border/60 shadow-sm bg-card/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t('calc.grossToNet')}</p>
              <span className="text-xs text-muted-foreground">{t('bonus.baseSalary')}</span>
            </div>
            <Input
              type="number"
              value={monthlyGross}
              onChange={(e) => setMonthlyGross(e.target.value)}
              placeholder={language === 'el' ? 'π.χ. 1500' : 'e.g. 1500'}
              onKeyDown={(e) => e.key === 'Enter' && handleGrossToNet()}
              className="h-12 text-lg"
            />
            <Button onClick={handleGrossToNet} className="w-full" size="lg">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              {t('bonus.apply')}
            </Button>
            {grossToNetResult && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-sm text-muted-foreground">{t('bonus.netResult')}</p>
                <p className="text-2xl font-display font-bold text-secondary">
                  {formatCurrency(grossToNetResult.netSalary)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({formatCurrency(grossToNetResult.grossSalary)} {language === 'el' ? 'μικτά δώρου' : 'gross bonus'})
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 rounded-xl border border-border/60 shadow-sm bg-card/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t('calc.netToGross')}</p>
              <span className="text-xs text-muted-foreground">{t('bonus.netResult')}</span>
            </div>
            <Input
              type="number"
              value={bonusNetTarget}
              onChange={(e) => setBonusNetTarget(e.target.value)}
              placeholder={language === 'el' ? 'π.χ. 700' : 'e.g. 700'}
              onKeyDown={(e) => e.key === 'Enter' && handleNetToGross()}
              className="h-12 text-lg"
            />
            <Button onClick={handleNetToGross} variant="secondary" className="w-full" size="lg">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              {t('bonus.apply')}
            </Button>
            {netToGrossResult && (
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-sm text-muted-foreground">{t('bonus.grossResult')}</p>
                <p className="text-2xl font-display font-bold text-primary">
                  {formatCurrency(netToGrossResult.grossSalary)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({formatCurrency(netToGrossResult.netSalary)} {language === 'el' ? 'καθαρά δώρου' : 'net bonus'})
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
