import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, ArrowRightLeft, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { calculateGrossToNet, calculateNetToGross, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { parseNumericExpression } from '@/lib/numberUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export function SalaryCalculator() {
  const { t, language } = useLanguage();
  const [grossInput, setGrossInput] = useState<string>('');
  const [netInput, setNetInput] = useState<string>('');
  const [children, setChildren] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<'gross' | 'net'>('gross');
  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);

  const recalcFromGross = (gross: number) => {
    const result = calculateGrossToNet(gross, 14, children);
    setBreakdown(result);
    setNetInput(result.netSalary.toFixed(2));
  };

  const recalcFromNet = (net: number) => {
    const result = calculateNetToGross(net, 14, children);
    setBreakdown(result);
    setGrossInput(result.grossSalary.toFixed(2));
  };

  const handleGrossChange = (value: string) => {
    setActiveSide('gross');
    setGrossInput(value);
<<<<<<< HEAD
    const gross = parseFloat(value);
    if (!isNaN(gross) && gross > 0) {
      recalcFromGross(gross);
    }
=======
>>>>>>> codex/check-calculations-for-bonuses
  };

  const handleNetChange = (value: string) => {
    setActiveSide('net');
    setNetInput(value);
<<<<<<< HEAD
    const net = parseFloat(value);
    if (!isNaN(net) && net > 0) {
      recalcFromNet(net);
    }
  };

  const handleGrossToNet = () => {
    const gross = parseFloat(grossInput);
    if (!isNaN(gross) && gross > 0) {
      setActiveSide('gross');
      recalcFromGross(gross);
=======
  };

  const handleGrossToNet = () => {
    const gross = parseNumericExpression(grossInput);
    if (gross !== null && gross > 0) {
      setActiveSide('gross');
      const formatted = gross.toFixed(2);
      setGrossInput(formatted);
      recalcFromGross(gross);
    } else if (breakdown) {
      setGrossInput(breakdown.grossSalary.toFixed(2));
>>>>>>> codex/check-calculations-for-bonuses
    }
  };

  const handleNetToGross = () => {
<<<<<<< HEAD
    const net = parseFloat(netInput);
    if (!isNaN(net) && net > 0) {
      setActiveSide('net');
      recalcFromNet(net);
    }
  };

=======
    const net = parseNumericExpression(netInput);
    if (net !== null && net > 0) {
      setActiveSide('net');
      const formatted = net.toFixed(2);
      setNetInput(formatted);
      recalcFromNet(net);
    } else if (breakdown) {
      setNetInput(breakdown.netSalary.toFixed(2));
    }
  };

  const commitGrossInput = () => {
    const gross = parseNumericExpression(grossInput);
    if (gross !== null && gross > 0) {
      const formatted = gross.toFixed(2);
      setGrossInput(formatted);
      recalcFromGross(gross);
    }
  };

  const commitNetInput = () => {
    const net = parseNumericExpression(netInput);
    if (net !== null && net > 0) {
      const formatted = net.toFixed(2);
      setNetInput(formatted);
      recalcFromNet(net);
    }
  };

>>>>>>> codex/check-calculations-for-bonuses
  const renderBreakdown = (result: SalaryBreakdown, isGrossToNet: boolean) => (
    <div className="mt-6 space-y-4 animate-slide-up">
      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-lg ${
            isGrossToNet ? 'bg-muted ring-2 ring-primary/30' : 'bg-secondary/10'
          }`}
        >
          <p className="text-sm text-muted-foreground mb-1">{t('calc.gross')}</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatCurrency(result.grossSalary)}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${
            isGrossToNet ? 'bg-secondary/10' : 'bg-muted ring-2 ring-secondary/30'
          }`}
        >
          <p className="text-sm text-muted-foreground mb-1">{t('calc.net')}</p>
          <p className="text-2xl font-display font-bold text-secondary">
            {formatCurrency(result.netSalary)}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-semibold text-foreground mb-3">{t('calc.breakdown')}</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">{t('calc.efka')}</span>
            <span className="font-medium text-destructive">-{formatCurrency(result.efkaEmployee)}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">{t('calc.incomeTax')}</span>
            <span className="font-medium text-destructive">-{formatCurrency(result.incomeTax)}</span>
          </div>
          {result.solidarityTax > 0 && (
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">{t('calc.solidarity')}</span>
              <span className="font-medium text-destructive">-{formatCurrency(result.solidarityTax)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="font-semibold text-foreground">{t('calc.totalDeductions')}</span>
            <span className="font-bold text-primary">-{formatCurrency(result.totalDeductions)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
        <p>{t('calc.note14')}</p>
        <p>{t('calc.noteSolidarity')}</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (!breakdown) return;

    const gross = parseFloat(grossInput);
    const net = parseFloat(netInput);

    if (activeSide === 'gross' && !isNaN(gross) && gross > 0) {
      recalcFromGross(gross);
    } else if (activeSide === 'net' && !isNaN(net) && net > 0) {
      recalcFromNet(net);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const getChildrenLabel = (num: number) => {
    if (num === 0) return t('calc.noChildren');
    if (language === 'el') {
      return `${num} ${num === 1 ? 'τέκνο' : 'τέκνα'}`;
    }
    return `${num} ${num === 1 ? 'child' : 'children'}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-lg">
          <Calculator className="w-7 h-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">{t('calc.title')}</CardTitle>
        <CardDescription>{t('calc.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="children" className="flex items-center gap-2 justify-center">
            <Users className="w-4 h-4" />
            {t('calc.children')}
          </Label>
          <select
            id="children"
            value={children}
            onChange={(e) => setChildren(parseInt(e.target.value))}
            className="w-full h-10 px-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <option key={num} value={num}>
                {getChildrenLabel(num)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="p-4 rounded-xl border border-border bg-muted/40">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4" />
              <p className="font-semibold">{t('calc.grossToNet')}</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="gross">{t('calc.grossSalary')}</Label>
                <Input
                  id="gross"
<<<<<<< HEAD
                  type="number"
                  placeholder={language === 'el' ? 'π.χ. 1500' : 'e.g. 1500'}
                  value={grossInput}
                  onChange={(e) => handleGrossChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGrossToNet()}
=======
                  type="text"
                  placeholder={language === 'el' ? 'π.χ. 1500' : 'e.g. 1500'}
                  value={grossInput}
                  onChange={(e) => handleGrossChange(e.target.value)}
                  onBlur={commitGrossInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGrossToNet();
                    }
                  }}
>>>>>>> codex/check-calculations-for-bonuses
                  className="text-lg h-12"
                />
              </div>
              <Button onClick={handleGrossToNet} className="w-full" size="lg">
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                {t('calc.calculateNet')}
              </Button>
              {breakdown && renderBreakdown(breakdown, activeSide === 'gross')}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/40">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              <p className="font-semibold">{t('calc.netToGross')}</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="net">{t('calc.netSalary')}</Label>
                <Input
                  id="net"
<<<<<<< HEAD
                  type="number"
                  placeholder={language === 'el' ? 'π.χ. 1200' : 'e.g. 1200'}
                  value={netInput}
                  onChange={(e) => handleNetChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNetToGross()}
=======
                  type="text"
                  placeholder={language === 'el' ? 'π.χ. 1200' : 'e.g. 1200'}
                  value={netInput}
                  onChange={(e) => handleNetChange(e.target.value)}
                  onBlur={commitNetInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNetToGross();
                    }
                  }}
>>>>>>> codex/check-calculations-for-bonuses
                  className="text-lg h-12"
                />
              </div>
              <Button onClick={handleNetToGross} variant="secondary" className="w-full" size="lg">
                <ArrowRightLeft className="w-5 h-5 mr-2" />
                {t('calc.calculateGross')}
              </Button>
              {breakdown && renderBreakdown(breakdown, activeSide === 'net')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
