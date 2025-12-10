import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, ArrowRightLeft, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { calculateGrossToNet, calculateNetToGross, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';

export function SalaryCalculator() {
  const { t, language } = useLanguage();
  const [grossInput, setGrossInput] = useState<string>('');
  const [netInput, setNetInput] = useState<string>('');
  const [children, setChildren] = useState<number>(0);
  const [grossResult, setGrossResult] = useState<SalaryBreakdown | null>(null);
  const [netResult, setNetResult] = useState<SalaryBreakdown | null>(null);
  const grossResultRef = useRef<HTMLDivElement>(null);
  const netResultRef = useRef<HTMLDivElement>(null);

  const handleGrossToNet = () => {
    const gross = parseFloat(grossInput);
    if (!isNaN(gross) && gross > 0) {
      setGrossResult(calculateGrossToNet(gross, 14, children));
      setTimeout(() => {
        grossResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleNetToGross = () => {
    const net = parseFloat(netInput);
    if (!isNaN(net) && net > 0) {
      setNetResult(calculateNetToGross(net, 14, children));
      setTimeout(() => {
        netResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const renderBreakdown = (breakdown: SalaryBreakdown, isGrossToNet: boolean, ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} className="mt-6 space-y-4 animate-slide-up">
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${isGrossToNet ? 'bg-muted' : 'bg-secondary/10'}`}>
          <p className="text-sm text-muted-foreground mb-1">{t('calc.gross')}</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatCurrency(breakdown.grossSalary)}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isGrossToNet ? 'bg-secondary/10' : 'bg-muted'}`}>
          <p className="text-sm text-muted-foreground mb-1">{t('calc.net')}</p>
          <p className="text-2xl font-display font-bold text-secondary">
            {formatCurrency(breakdown.netSalary)}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-semibold text-foreground mb-3">{t('calc.breakdown')}</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">{t('calc.efka')}</span>
            <span className="font-medium text-destructive">-{formatCurrency(breakdown.efkaEmployee)}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">{t('calc.incomeTax')}</span>
            <span className="font-medium text-destructive">-{formatCurrency(breakdown.incomeTax)}</span>
          </div>
          {breakdown.solidarityTax > 0 && (
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">{t('calc.solidarity')}</span>
              <span className="font-medium text-destructive">-{formatCurrency(breakdown.solidarityTax)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="font-semibold text-foreground">{t('calc.totalDeductions')}</span>
            <span className="font-bold text-primary">-{formatCurrency(breakdown.totalDeductions)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
        <p>{t('calc.note14')}</p>
        <p>{t('calc.noteSolidarity')}</p>
      </div>
    </div>
  );

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
        <div className="mx-auto w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-lg">
          <Calculator className="w-7 h-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">{t('calc.title')}</CardTitle>
        <CardDescription>{t('calc.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gross-to-net" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="gross-to-net" className="gap-2">
              <TrendingDown className="w-4 h-4" />
              {t('calc.grossToNet')}
            </TabsTrigger>
            <TabsTrigger value="net-to-gross" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              {t('calc.netToGross')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gross-to-net" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gross">{t('calc.grossSalary')}</Label>
              <Input
                id="gross"
                type="number"
                placeholder={language === 'el' ? 'π.χ. 1500' : 'e.g. 1500'}
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGrossToNet()}
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children-gross" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('calc.children')}
              </Label>
              <select
                id="children-gross"
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
            <Button onClick={handleGrossToNet} className="w-full" size="lg">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              {t('calc.calculateNet')}
            </Button>
            {grossResult && renderBreakdown(grossResult, true, grossResultRef)}
          </TabsContent>

          <TabsContent value="net-to-gross" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="net">{t('calc.netSalary')}</Label>
              <Input
                id="net"
                type="number"
                placeholder={language === 'el' ? 'π.χ. 1200' : 'e.g. 1200'}
                value={netInput}
                onChange={(e) => setNetInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNetToGross()}
                className="text-lg h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children-net" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('calc.children')}
              </Label>
              <select
                id="children-net"
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
            <Button onClick={handleNetToGross} variant="secondary" className="w-full" size="lg">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              {t('calc.calculateGross')}
            </Button>
            {netResult && renderBreakdown(netResult, false, netResultRef)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
