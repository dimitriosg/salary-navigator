import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Building2, Users } from 'lucide-react';
import { calculateGrossToNet, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmployerCost extends SalaryBreakdown {
  totalEmployerCost: number;
}

function calculateEmployerCost(monthlyGross: number, months: number = 14, children: number = 0): EmployerCost {
  const breakdown = calculateGrossToNet(monthlyGross, months, children);
  const totalEmployerCost = monthlyGross + breakdown.efkaEmployer;
  
  return {
    ...breakdown,
    totalEmployerCost,
  };
}

export function EmployerCostCalculator() {
  const { t, language } = useLanguage();
  const [grossInput, setGrossInput] = useState<string>('');
  const [children, setChildren] = useState<number>(0);
  const [result, setResult] = useState<EmployerCost | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const gross = parseFloat(grossInput);
    if (!isNaN(gross) && gross > 0) {
      setResult(calculateEmployerCost(gross, 14, children));
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const getChildrenLabel = (num: number) => {
    if (num === 0) return t('calc.noChildren');
    if (language === 'el') {
      return `${num} ${num === 1 ? 'τέκνο' : 'τέκνα'}`;
    }
    return `${num} ${num === 1 ? 'child' : 'children'}`;
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-14 h-14 rounded-full gradient-accent flex items-center justify-center mb-4 shadow-lg">
          <Building2 className="w-7 h-7 text-accent-foreground" />
        </div>
        <CardTitle className="text-2xl">{t('employer.title')}</CardTitle>
        <CardDescription>{t('employer.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employer-gross">{t('calc.grossSalary')}</Label>
          <Input
            id="employer-gross"
            type="number"
            placeholder={language === 'el' ? 'π.χ. 1500' : 'e.g. 1500'}
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            className="text-lg h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="children-employer" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('calc.children')}
          </Label>
          <select
            id="children-employer"
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
        <Button onClick={handleCalculate} className="w-full" size="lg">
          <Calculator className="w-5 h-5 mr-2" />
          {t('employer.calculate')}
        </Button>

        {result && (
          <div ref={resultRef} className="mt-6 space-y-4 animate-slide-up">
            {/* Main cost summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-1">{t('calc.gross')}</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatCurrency(result.grossSalary)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">{t('employer.totalCost')}</p>
                <p className="text-2xl font-display font-bold text-accent">
                  {formatCurrency(result.totalEmployerCost)}
                </p>
              </div>
            </div>

            {/* Employee receives */}
            <div className="p-4 rounded-lg bg-secondary/10">
              <p className="text-sm text-muted-foreground mb-1">{t('employer.netToEmployee')}</p>
              <p className="text-xl font-display font-bold text-secondary">
                {formatCurrency(result.netSalary)}
              </p>
            </div>

            {/* Breakdown */}
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-foreground mb-3">{t('employer.breakdownTitle')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">{t('employer.efkaEmployee')}</span>
                  <span className="font-medium text-foreground">{formatCurrency(result.efkaEmployee)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-accent/5 border border-accent/10">
                  <span className="text-sm text-muted-foreground">{t('employer.efkaEmployer')}</span>
                  <span className="font-medium text-accent">{formatCurrency(result.efkaEmployer)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">{t('calc.incomeTax')}</span>
                  <span className="font-medium text-foreground">{formatCurrency(result.incomeTax)}</span>
                </div>
              </div>
            </div>

            {/* Summary comparison */}
            <div className="border-t border-border pt-4">
              <h4 className="font-semibold text-foreground mb-3">{t('employer.comparison')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">{t('employer.totalContributions')}</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(result.efkaEmployee + result.efkaEmployer)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">{t('employer.costPercent')}</span>
                  <span className="font-medium text-foreground">
                    {(((result.efkaEmployee + result.efkaEmployer) / result.totalEmployerCost) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">{t('employer.netPercent')}</span>
                  <span className="font-medium text-secondary">
                    {((result.netSalary / result.totalEmployerCost) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
              <p>{t('calc.note14')}</p>
              <p>{t('employer.noteEmployer')}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
