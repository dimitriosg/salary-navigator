// Greek salary calculation utilities (2024 rates)

export interface SalaryBreakdown {
  grossSalary: number;
  netSalary: number;
  efkaEmployee: number;
  efkaEmployer: number;
  incomeTax: number;
  solidarityTax: number;
  totalDeductions: number;
}

// EFKA contribution rates (employee portion)
const EFKA_EMPLOYEE_RATE = 0.1387; // 13.87%
const EFKA_EMPLOYER_RATE = 0.2206; // 22.06%

// Income tax brackets for 2024
const TAX_BRACKETS = [
  { limit: 10000, rate: 0.09 },
  { limit: 20000, rate: 0.22 },
  { limit: 30000, rate: 0.28 },
  { limit: 40000, rate: 0.36 },
  { limit: Infinity, rate: 0.44 },
];

// Solidarity tax is suspended for 2024, but we keep the logic
const SOLIDARITY_SUSPENDED = true;
const SOLIDARITY_BRACKETS = [
  { limit: 12000, rate: 0 },
  { limit: 20000, rate: 0.022 },
  { limit: 30000, rate: 0.05 },
  { limit: 40000, rate: 0.065 },
  { limit: 65000, rate: 0.075 },
  { limit: 220000, rate: 0.09 },
  { limit: Infinity, rate: 0.10 },
];

// Tax credit for salaried employees (2024)
// 777€ for income ≤ 12,000€, decreases linearly to 0€ at 36,000€
function getTaxCredit(annualIncome: number): number {
  if (annualIncome <= 12000) {
    return 777;
  } else if (annualIncome < 36000) {
    // Linear decrease: 777 at 12,000€ → 0 at 36,000€
    return Math.max(0, 777 - (annualIncome - 12000) * (777 / 24000));
  }
  return 0;
}

function calculateIncomeTax(annualTaxableIncome: number): number {
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
  const credit = getTaxCredit(annualTaxableIncome);
  tax = Math.max(0, tax - credit);

  return tax;
}

function calculateSolidarityTax(annualIncome: number): number {
  if (SOLIDARITY_SUSPENDED) return 0;
  
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of SOLIDARITY_BRACKETS) {
    if (annualIncome <= previousLimit) break;
    
    const taxableInBracket = Math.min(
      annualIncome - previousLimit,
      bracket.limit - previousLimit
    );
    
    tax += taxableInBracket * bracket.rate;
    previousLimit = bracket.limit;
  }

  return tax;
}

export function calculateGrossToNet(monthlyGross: number, months: number = 14): SalaryBreakdown {
  const annualGross = monthlyGross * months;
  
  // EFKA contributions
  const annualEfkaEmployee = annualGross * EFKA_EMPLOYEE_RATE;
  const annualEfkaEmployer = annualGross * EFKA_EMPLOYER_RATE;
  
  // Taxable income (after EFKA deduction)
  const annualTaxableIncome = annualGross - annualEfkaEmployee;
  
  // Calculate taxes
  const annualIncomeTax = calculateIncomeTax(annualTaxableIncome);
  const annualSolidarityTax = calculateSolidarityTax(annualTaxableIncome);
  
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

export function calculateNetToGross(monthlyNet: number, months: number = 14): SalaryBreakdown {
  // Use binary search to find the gross salary that results in the target net
  let low = monthlyNet;
  let high = monthlyNet * 3; // Assume gross won't be more than 3x net
  let result: SalaryBreakdown | null = null;

  while (high - low > 0.01) {
    const mid = (low + high) / 2;
    const breakdown = calculateGrossToNet(mid, months);
    
    if (breakdown.netSalary < monthlyNet) {
      low = mid;
    } else {
      high = mid;
      result = breakdown;
    }
  }

  return result || calculateGrossToNet(high, months);
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
}

export function calculateYearlySummary(salaries: { month: string; gross: number }[]): YearlySummary {
  const totalGross = salaries.reduce((sum, s) => sum + s.gross, 0);
  
  // Calculate annual tax based on total income
  const annualEfkaEmployee = totalGross * EFKA_EMPLOYEE_RATE;
  const annualEfkaEmployer = totalGross * EFKA_EMPLOYER_RATE;
  const taxableIncome = totalGross - annualEfkaEmployee;
  const annualIncomeTax = calculateIncomeTax(taxableIncome);
  const annualSolidarityTax = calculateSolidarityTax(taxableIncome);
  const totalDeductions = annualEfkaEmployee + annualIncomeTax + annualSolidarityTax;
  const totalNet = totalGross - totalDeductions;

  const monthlySalaries = salaries.map(s => {
    const breakdown = calculateGrossToNet(s.gross, 1);
    return {
      month: s.month,
      gross: s.gross,
      net: breakdown.netSalary,
    };
  });

  return {
    totalGross,
    totalNet,
    totalEfkaEmployee: annualEfkaEmployee,
    totalEfkaEmployer: annualEfkaEmployer,
    totalIncomeTax: annualIncomeTax,
    totalSolidarityTax: annualSolidarityTax,
    totalDeductions,
    monthlySalaries,
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
  'Δώρο Πάσχα',
  'Δώρο Χριστουγέννων',
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
