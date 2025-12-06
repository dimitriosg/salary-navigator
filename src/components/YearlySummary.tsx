import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, PiggyBank, Receipt, FileText, Trash2, Plus } from 'lucide-react';
import { calculateYearlySummary, formatCurrency, GREEK_MONTHS, type YearlySummary as YearlySummaryType } from '@/lib/salaryCalculations';

interface MonthlySalary {
  month: string;
  gross: number;
}

export function YearlySummary() {
  const [salaries, setSalaries] = useState<MonthlySalary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(GREEK_MONTHS[0]);
  const [grossAmount, setGrossAmount] = useState<string>('');
  const [summary, setSummary] = useState<YearlySummaryType | null>(null);

  const addSalary = () => {
    const gross = parseFloat(grossAmount);
    if (!isNaN(gross) && gross > 0) {
      const newSalaries = [...salaries, { month: selectedMonth, gross }];
      setSalaries(newSalaries);
      setGrossAmount('');
      
      // Recalculate summary
      if (newSalaries.length > 0) {
        setSummary(calculateYearlySummary(newSalaries));
      }
    }
  };

  const removeSalary = (index: number) => {
    const newSalaries = salaries.filter((_, i) => i !== index);
    setSalaries(newSalaries);
    if (newSalaries.length > 0) {
      setSummary(calculateYearlySummary(newSalaries));
    } else {
      setSummary(null);
    }
  };

  const fillWithSameSalary = () => {
    const gross = parseFloat(grossAmount);
    if (!isNaN(gross) && gross > 0) {
      const allSalaries = GREEK_MONTHS.map(month => ({ month, gross }));
      setSalaries(allSalaries);
      setSummary(calculateYearlySummary(allSalaries));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-14 h-14 rounded-full gradient-secondary flex items-center justify-center mb-4 shadow-lg">
          <CalendarDays className="w-7 h-7 text-secondary-foreground" />
        </div>
        <CardTitle className="text-2xl">Ετήσια Σύνοψη</CardTitle>
        <CardDescription>Καταχωρήστε τους μισθούς σας για πρόβλεψη φορολογικής δήλωσης</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid gap-4 p-4 bg-muted/30 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Μήνας</Label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {GREEK_MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Μικτός Μισθός (€)</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="π.χ. 1500"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSalary()}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addSalary} className="flex-1" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Προσθήκη
            </Button>
            <Button onClick={fillWithSameSalary} variant="outline" size="lg" className="flex-1">
              Ίδιος μισθός όλη τη χρονιά
            </Button>
          </div>
        </div>

        {/* Salaries List */}
        {salaries.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Καταχωρημένοι Μισθοί ({salaries.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
              {salaries.map((salary, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
                >
                  <span className="text-sm text-foreground">{salary.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{formatCurrency(salary.gross)}</span>
                    <button
                      onClick={() => removeSalary(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="space-y-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted">
                <p className="text-sm text-muted-foreground mb-1">Ετήσια Μικτά</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatCurrency(summary.totalGross)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/10">
                <p className="text-sm text-muted-foreground mb-1">Ετήσια Καθαρά</p>
                <p className="text-2xl font-display font-bold text-secondary">
                  {formatCurrency(summary.totalNet)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Στοιχεία για Φορολογική Δήλωση
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                  <span className="text-sm text-foreground">ΕΦΚΑ Εργαζομένου</span>
                  <span className="font-bold text-destructive">{formatCurrency(summary.totalEfkaEmployee)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                  <span className="text-sm text-foreground">Φόρος Εισοδήματος</span>
                  <span className="font-bold text-destructive">{formatCurrency(summary.totalIncomeTax)}</span>
                </div>
                {summary.totalSolidarityTax > 0 && (
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                    <span className="text-sm text-foreground">Εισφορά Αλληλεγγύης</span>
                    <span className="font-bold text-destructive">{formatCurrency(summary.totalSolidarityTax)}</span>
                  </div>
                )}
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-semibold text-foreground">Συνολικές Κρατήσεις</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(summary.totalDeductions)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex items-start gap-3">
                <PiggyBank className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-foreground mb-1">Πρόβλεψη Φορολογικής Δήλωσης</h5>
                  <p className="text-sm text-muted-foreground">
                    Με βάση τις εισφορές που έχετε πληρώσει, το φορολογητέο εισόδημά σας είναι{' '}
                    <strong className="text-foreground">{formatCurrency(summary.totalGross - summary.totalEfkaEmployee)}</strong>
                    . Ο παρακρατηθείς φόρος είναι{' '}
                    <strong className="text-foreground">{formatCurrency(summary.totalIncomeTax)}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
