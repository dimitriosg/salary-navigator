// Greek salary calculation utilities (2024/2025 rates)
// Based on aftertax.gr and jobfind.gr calculations

export interface SalaryBreakdown {
  grossSalary: number;
  netSalary: number;
  efkaEmployee: number;
  efkaEmployer: number;
  incomeTax: number;
  solidarityTax: number;
  totalDeductions: number;
}

// EFKA contribution rates (IKA)
// Source: aftertax.gr - 13.37% employee
const EFKA_EMPLOYEE_RATE = 0.1337; // 13.37%
const EFKA_EMPLOYER_RATE = 0.2179; // 21.79%

// Income tax brackets for 2024/2025
const TAX_BRACKETS = [
  { limit: 10000, rate: 0.09 },
  { limit: 20000, rate: 0.22 },
  { limit: 30000, rate: 0.28 },
  { limit: 40000, rate: 0.36 },
  { limit: Infinity, rate: 0.44 },
];

// Solidarity tax is suspended since 2021 for private sector
const SOLIDARITY_SUSPENDED = true;

// Tax credit based on number of children (2024)
const TAX_CREDIT_BY_CHILDREN: Record<number, number> = {
  0: 777,
  1: 900,
  2: 1120,
  3: 1340,
  4: 1580,
  5: 1800,
  6: 2000,
  7: 2220,
  8: 2440,
  9: 2660,
};

// Tax credit calculation
// Base credit decreases by 20€ for every 1,000€ of taxable income above 12,000€
function getTaxCredit(annualTaxableIncome: number, children: number = 0): number {
  const baseCredit = TAX_CREDIT_BY_CHILDREN[Math.min(children, 9)] || 777;
  
  if (annualTaxableIncome <= 12000) {
    return baseCredit;
  }
  
  // Decrease by 20€ for every 1,000€ above 12,000€
  const reduction = ((annualTaxableIncome - 12000) / 1000) * 20;
  return Math.max(0, baseCredit - reduction);
}

function calculateIncomeTax(annualTaxableIncome: number, children: number = 0): number {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    if (annualTaxableIncome <= previousLimit) break;
    
    const taxableInBracket = Math.min(
      annualTaxableIncome - previousLimit,
      bracket.limit - previousLimit
    );
    
    tax += taxableInBracket * bracket.rate;
    previousLimit = bracket.limit;
  }

  // Apply tax credit
  const credit = getTaxCredit(annualTaxableIncome, children);
  tax = Math.max(0, tax - credit);

  return tax;
}

export function calculateGrossToNet(monthlyGross: number, months: number = 14, children: number = 0): SalaryBreakdown {
  const annualGross = monthlyGross * months;
  
  // EFKA contributions
  const annualEfkaEmployee = annualGross * EFKA_EMPLOYEE_RATE;
  const annualEfkaEmployer = annualGross * EFKA_EMPLOYER_RATE;
  
  // Taxable income (after EFKA deduction)
  const annualTaxableIncome = annualGross - annualEfkaEmployee;
  
  // Calculate taxes
  const annualIncomeTax = calculateIncomeTax(annualTaxableIncome, children);
  const annualSolidarityTax = 0; // Suspended
  
  // Total deductions
  const totalAnnualDeductions = annualEfkaEmployee + annualIncomeTax + annualSolidarityTax;
  
  // Net salary
  const annualNet = annualGross - totalAnnualDeductions;
  const monthlyNet = annualNet / months;

  return {
    grossSalary: monthlyGross,
    netSalary: monthlyNet,
    efkaEmployee: annualEfkaEmployee / months,
    efkaEmployer: annualEfkaEmployer / months,
    incomeTax: annualIncomeTax / months,
    solidarityTax: annualSolidarityTax / months,
    totalDeductions: totalAnnualDeductions / months,
  };
}

export function calculateNetToGross(monthlyNet: number, months: number = 14, children: number = 0): SalaryBreakdown {
  // Use binary search to find the gross salary that results in the target net
  let low = monthlyNet;
  let high = monthlyNet * 3; // Assume gross won't be more than 3x net
  let result: SalaryBreakdown | null = null;

  while (high - low > 0.01) {
    const mid = (low + high) / 2;
    const breakdown = calculateGrossToNet(mid, months, children);
    
    if (breakdown.netSalary < monthlyNet) {
      low = mid;
    } else {
      high = mid;
      result = breakdown;
    }
  }

  return result || calculateGrossToNet(high, months, children);
}

export interface BonusBreakdown {
  easter: number;
  christmas: number;
  vacation: number;
  total: number;
}

export interface YearlySummary {
  totalGross: number;
  totalNet: number;
  totalEfkaEmployee: number;
  totalEfkaEmployer: number;
  totalIncomeTax: number;
  totalSolidarityTax: number;
  totalDeductions: number;
  monthlySalaries: { month: string; gross: number; net: number }[];
  bonusBreakdown: BonusBreakdown;
  simpleAnnualGross14: number;
  baseMonthlyGross: number;
}

function calculateEasterBonusGross(monthlyGross: number): number {
  const base = monthlyGross * 0.5;
  return base + base / 24;
}

function calculateChristmasBonusGross(monthlyGross: number): number {
  const base = monthlyGross;
  return base + base / 24;
}

function calculateVacationAllowanceGross(monthlyGross: number): number {
  return monthlyGross * 0.5;
}

export function calculateYearlySummary(
  salaries: { month: string; gross: number }[],
  children: number = 0
): YearlySummary {
  const totalRegularGross = salaries.reduce((sum, salary) => sum + salary.gross, 0);
  const monthsCount = salaries.length || 1;
  const baseMonthlyGross = totalRegularGross / monthsCount;

  const easterBonus = calculateEasterBonusGross(baseMonthlyGross);
  const christmasBonus = calculateChristmasBonusGross(baseMonthlyGross);
  const vacationAllowance = calculateVacationAllowanceGross(baseMonthlyGross);

  const bonusBreakdown: BonusBreakdown = {
    easter: easterBonus,
    christmas: christmasBonus,
    vacation: vacationAllowance,
    total: easterBonus + christmasBonus + vacationAllowance,
  };

  const totalGross = totalRegularGross + bonusBreakdown.total;
  const totalEfkaEmployee = totalGross * EFKA_EMPLOYEE_RATE;
  const totalEfkaEmployer = totalGross * EFKA_EMPLOYER_RATE;
  const totalIncomeTax = calculateIncomeTax(totalGross - totalEfkaEmployee, children);
  const totalSolidarityTax = SOLIDARITY_SUSPENDED ? 0 : calculateIncomeTax(totalGross - totalEfkaEmployee, children);
  const totalDeductions = totalEfkaEmployee + totalIncomeTax + totalSolidarityTax;
  const totalNet = totalGross - totalDeductions;

  const monthlySalaries = salaries.map(({ month, gross }) => {
    if (totalRegularGross === 0) {
      return { month, gross: 0, net: 0 };
    }

    const proportion = gross / totalRegularGross;
    return {
      month,
      gross,
      net: totalNet * (gross / totalGross),
    };
  });

  return {
    totalGross,
    totalNet,
    totalEfkaEmployee,
    totalEfkaEmployer,
    totalIncomeTax,
    totalSolidarityTax,
    totalDeductions,
    monthlySalaries,
    bonusBreakdown,
    simpleAnnualGross14: baseMonthlyGross * 14,
    baseMonthlyGross,
  };
}

export const GREEK_MONTHS = [
  'Ιανουάριος',
  'Φεβρουάριος',
  'Μάρτιος',
  'Απρίλιος',
  'Μάιος',
  'Ιούνιος',
  'Ιούλιος',
  'Αύγουστος',
  'Σεπτέμβριος',
  'Οκτώβριος',
  'Νοέμβριος',
  'Δεκέμβριος',
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
