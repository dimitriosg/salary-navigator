import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays, PiggyBank, Receipt, FileText, Trash2, Plus, Users, Pencil, Check, X, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateYearlySummary, formatCurrency, GREEK_MONTHS, type YearlySummary as YearlySummaryType } from '@/lib/salaryCalculations';
import { useLanguage } from '@/contexts/LanguageContext';

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
  'Christmas Bonus', 'Easter Bonus'
];

interface MonthlySalary {
  month: string;
  gross: number;
}

export function YearlySummary() {
  const { t, language } = useLanguage();
  const months = language === 'el' ? GREEK_MONTHS : ENGLISH_MONTHS;
  
  const [salaries, setSalaries] = useState<MonthlySalary[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0]);
  const [grossAmount, setGrossAmount] = useState<string>('');
  const [children, setChildren] = useState<number>(0);
  const [summary, setSummary] = useState<YearlySummaryType | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Calculate standard salary comparison
  const comparison = useMemo(() => {
    if (!summary || salaries.length === 0) return null;
    
    // Find the base salary (most common or first regular month salary)
    const regularMonthSalaries = salaries.filter(s => 
      !s.month.includes('Δώρο') && !s.month.includes('Bonus')
    );
    
    if (regularMonthSalaries.length === 0) return null;
    
    // Use the minimum salary as the "standard" (without bonuses)
    const baseSalary = Math.min(...regularMonthSalaries.map(s => s.gross));
    
    // Check if there are any variations
    const hasVariations = salaries.some(s => {
      const isBonus = s.month.includes('Δώρο') || s.month.includes('Bonus');
      return !isBonus && s.gross !== baseSalary;
    });
    
    if (!hasVariations) return null;
    
    // Calculate what the summary would be with standard salary
    const standardSalaries = GREEK_MONTHS.map(month => ({ month, gross: baseSalary }));
    const standardSummary = calculateYearlySummary(standardSalaries, children);
    
    const extraGross = summary.totalGross - standardSummary.totalGross;
    const extraTax = summary.totalIncomeTax - standardSummary.totalIncomeTax;
    const extraEfka = summary.totalEfkaEmployee - standardSummary.totalEfkaEmployee;
    
    return {
      standardSummary,
      extraGross,
      extraTax,
      extraEfka,
      baseSalary,
    };
  }, [summary, salaries, children]);

  const recalculateSummary = (newSalaries: MonthlySalary[]) => {
    if (newSalaries.length > 0) {
      setSummary(calculateYearlySummary(newSalaries, children));
    } else {
      setSummary(null);
    }
  };

  const addSalary = () => {
    const gross = parseFloat(grossAmount);
    if (!isNaN(gross) && gross > 0) {
      const newSalaries = [...salaries, { month: selectedMonth, gross }];
      setSalaries(newSalaries);
      setGrossAmount('');
      recalculateSummary(newSalaries);
    }
  };

  const removeSalary = (index: number) => {
    const newSalaries = salaries.filter((_, i) => i !== index);
    setSalaries(newSalaries);
    recalculateSummary(newSalaries);
  };

  const fillWithSameSalary = () => {
    const gross = parseFloat(grossAmount);
    if (!isNaN(gross) && gross > 0) {
      const allSalaries = months.map((month, i) => ({ month, gross }));
      setSalaries(allSalaries);
      recalculateSummary(allSalaries);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(salaries[index].gross.toString());
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const saveEdit = (index: number) => {
    const gross = parseFloat(editValue);
    if (!isNaN(gross) && gross > 0) {
      const newSalaries = [...salaries];
      newSalaries[index] = { ...newSalaries[index], gross };
      setSalaries(newSalaries);
      recalculateSummary(newSalaries);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const handleChildrenChange = (newChildren: number) => {
    setChildren(newChildren);
    if (salaries.length > 0) {
      setSummary(calculateYearlySummary(salaries, newChildren));
    }
  };

  const getChildrenLabel = (num: number) => {
    if (num === 0) return t('yearly.without');
    return num.toString();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-14 h-14 rounded-full gradient-secondary flex items-center justify-center mb-4 shadow-lg">
          <CalendarDays className="w-7 h-7 text-secondary-foreground" />
        </div>
        <CardTitle className="text-2xl">{t('yearly.title')}</CardTitle>
        <CardDescription>{t('yearly.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid gap-4 p-4 bg-muted/30 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">{t('yearly.month')}</Label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossSalary">{t('yearly.grossSalary')}</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder={language === 'el' ? 'π.χ. 1500' : 'e.g. 1500'}
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSalary()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="children-yearly" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('yearly.children.short')}
              </Label>
              <select
                id="children-yearly"
                value={children}
                onChange={(e) => handleChildrenChange(parseInt(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {getChildrenLabel(num)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addSalary} className="flex-1" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              {t('yearly.add')}
            </Button>
            <Button onClick={fillWithSameSalary} variant="outline" size="lg" className="flex-1">
              {t('yearly.sameYear')}
            </Button>
          </div>
        </div>

        {/* Salaries List */}
        {salaries.length > 0 && (
          <div className="space-y-2 animate-fade-in">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              {t('yearly.registered')} ({salaries.length})
              <span className="text-xs text-muted-foreground font-normal ml-2">
                {t('yearly.editHint')}
              </span>
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-1 pr-2">
              {salaries.map((salary, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
                >
                  <span className="text-sm text-foreground">{salary.month}</span>
                  <div className="flex items-center gap-2">
                    {editingIndex === index ? (
                      <>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(index);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          className="w-24 h-8 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(index)}
                          className="text-secondary hover:text-secondary/80 p-1"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-destructive hover:text-destructive/80 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-foreground">{formatCurrency(salary.gross)}</span>
                        <button
                          onClick={() => startEditing(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-1"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeSalary(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
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
                <p className="text-sm text-muted-foreground mb-1">{t('yearly.yearlyGross')}</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  {formatCurrency(summary.totalGross)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/10">
                <p className="text-sm text-muted-foreground mb-1">{t('yearly.yearlyNet')}</p>
                <p className="text-2xl font-display font-bold text-secondary">
                  {formatCurrency(summary.totalNet)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t('yearly.taxDeclaration')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                  <span className="text-sm text-foreground">{t('yearly.efkaEmployee')}</span>
                  <span className="font-bold text-destructive">{formatCurrency(summary.totalEfkaEmployee)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                  <span className="text-sm text-foreground">{t('yearly.incomeTax')}</span>
                  <span className="font-bold text-destructive">{formatCurrency(summary.totalIncomeTax)}</span>
                </div>
                {summary.totalSolidarityTax > 0 && (
                  <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                    <span className="text-sm text-foreground">{t('yearly.solidarity')}</span>
                    <span className="font-bold text-destructive">{formatCurrency(summary.totalSolidarityTax)}</span>
                  </div>
                )}
                <div className="border-t border-border my-2"></div>
                <div className="flex justify-between items-center py-3 px-3 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-semibold text-foreground">{t('yearly.totalDeductions')}</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(summary.totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Bonus Comparison */}
            {comparison && (
              <div className="p-4 rounded-xl border border-accent/30 bg-accent/5">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  {t('yearly.comparison')}
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground mb-1">{t('yearly.standardSalary')}</p>
                      <p className="font-semibold text-foreground">{formatCurrency(comparison.baseSalary)}/μήνα</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'el' ? 'Φόρος:' : 'Tax:'} {formatCurrency(comparison.standardSummary.totalIncomeTax)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10">
                      <p className="text-muted-foreground mb-1">{t('yearly.actualSalary')}</p>
                      <p className="font-semibold text-foreground">{formatCurrency(summary.totalGross)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'el' ? 'Φόρος:' : 'Tax:'} {formatCurrency(summary.totalIncomeTax)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-destructive" />
                      {t('yearly.difference')}
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">{t('yearly.extraGross')}</span>
                        <span className="font-medium text-foreground">+{formatCurrency(comparison.extraGross)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-destructive/10">
                        <span className="text-sm text-foreground">{t('yearly.extraTax')}</span>
                        <span className="font-bold text-destructive">+{formatCurrency(comparison.extraTax)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                    {t('yearly.noBonus')} <strong className="text-foreground">{formatCurrency(comparison.extraTax)}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex items-start gap-3">
                <PiggyBank className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-foreground mb-1">{t('yearly.prediction')}</h5>
                  <p className="text-sm text-muted-foreground">
                    {t('yearly.predictionText')}{' '}
                    <strong className="text-foreground">{formatCurrency(summary.totalGross - summary.totalEfkaEmployee)}</strong>
                    . {t('yearly.withheldTax')}{' '}
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
