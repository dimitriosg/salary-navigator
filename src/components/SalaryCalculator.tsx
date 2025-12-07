import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateGrossToNet, calculateNetToGross, formatCurrency, type SalaryBreakdown } from '@/lib/salaryCalculations';

export function SalaryCalculator() {
  const [grossInput, setGrossInput] = useState<string>('');
  const [netInput, setNetInput] = useState<string>('');
  const [grossResult, setGrossResult] = useState<SalaryBreakdown | null>(null);
  const [netResult, setNetResult] = useState<SalaryBreakdown | null>(null);

  const handleGrossToNet = () => {
    const gross = parseFloat(grossInput);
    if (!isNaN(gross) && gross > 0) {
      setGrossResult(calculateGrossToNet(gross));
    }
  };

  const handleNetToGross = () => {
    const net = parseFloat(netInput);
    if (!isNaN(net) && net > 0) {
      setNetResult(calculateNetToGross(net));
    }
  };

  const renderBreakdown = (breakdown: SalaryBreakdown, isGrossToNet: boolean) => (
    <div className="mt-6 space-y-4 animate-slide-up">
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${isGrossToNet ? 'bg-muted' : 'bg-secondary/10'}`}>
          <p className="text-sm text-muted-foreground mb-1">Μικτός Μισθός</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {formatCurrency(breakdown.grossSalary)}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isGrossToNet ? 'bg-secondary/10' : 'bg-muted'}`}>
          <p className="text-sm text-muted-foreground mb-1">Καθαρός Μισθός</p>
          <p className="text-2xl font-display font-bold text-secondary">
            {formatCurrency(breakdown.netSalary)}
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="font-semibold text-foreground mb-3">Ανάλυση Κρατήσεων</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">ΕΦΚΑ Εργαζομένου (13.40%)</span>
            <span className="font-medium text-destructive">-{formatCurrency(breakdown.efkaEmployee)}</span>
          </div>
          <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
            <span className="text-sm text-muted-foreground">Φόρος Εισοδήματος</span>
            <span className="font-medium text-destructive">-{formatCurrency(breakdown.incomeTax)}</span>
          </div>
          {breakdown.solidarityTax > 0 && (
            <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">Εισφορά Αλληλεγγύης</span>
              <span className="font-medium text-destructive">-{formatCurrency(breakdown.solidarityTax)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-primary/10 border border-primary/20">
            <span className="font-semibold text-foreground">Συνολικές Κρατήσεις</span>
            <span className="font-bold text-primary">-{formatCurrency(breakdown.totalDeductions)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
        <p>* Υπολογισμοί βάσει 14 μισθών (12 + Δώρα)</p>
        <p>* Εισφορά Αλληλεγγύης: Αναστολή για 2024</p>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-4 shadow-lg">
          <Calculator className="w-7 h-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Υπολογιστής Μισθού</CardTitle>
        <CardDescription>Υπολογίστε τον μισθό σας με βάση τα ελληνικά φορολογικά δεδομένα 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gross-to-net" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="gross-to-net" className="gap-2">
              <TrendingDown className="w-4 h-4" />
              Μικτά → Καθαρά
            </TabsTrigger>
            <TabsTrigger value="net-to-gross" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Καθαρά → Μικτά
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gross-to-net" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gross">Μηνιαίος Μικτός Μισθός (€)</Label>
              <Input
                id="gross"
                type="number"
                placeholder="π.χ. 1500"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGrossToNet()}
                className="text-lg h-12"
              />
            </div>
            <Button onClick={handleGrossToNet} className="w-full" size="lg">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              Υπολογισμός Καθαρού
            </Button>
            {grossResult && renderBreakdown(grossResult, true)}
          </TabsContent>

          <TabsContent value="net-to-gross" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="net">Επιθυμητός Καθαρός Μισθός (€)</Label>
              <Input
                id="net"
                type="number"
                placeholder="π.χ. 1200"
                value={netInput}
                onChange={(e) => setNetInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNetToGross()}
                className="text-lg h-12"
              />
            </div>
            <Button onClick={handleNetToGross} variant="secondary" className="w-full" size="lg">
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              Υπολογισμός Μικτού
            </Button>
            {netResult && renderBreakdown(netResult, false)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
