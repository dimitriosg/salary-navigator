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

export function calculateIncomeTax(annualTaxableIncome: number, children: number = 0): number {
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

export function calculateBonusWithholdings(
  baseMonthlyGross: number,
  bonusGross: number,
  months: number = 14,
  children: number = 0
): SalaryBreakdown {
  const baseAnnualGross = baseMonthlyGross * months;
  const baseAnnualEfkaEmployee = baseAnnualGross * EFKA_EMPLOYEE_RATE;
  const baseAnnualEfkaEmployer = baseAnnualGross * EFKA_EMPLOYER_RATE;
  const baseAnnualTaxableIncome = baseAnnualGross - baseAnnualEfkaEmployee;
  const baseAnnualIncomeTax = calculateIncomeTax(baseAnnualTaxableIncome, children);

  const bonusEfkaEmployee = bonusGross * EFKA_EMPLOYEE_RATE;
  const bonusEfkaEmployer = bonusGross * EFKA_EMPLOYER_RATE;

  const totalAnnualGross = baseAnnualGross + bonusGross;
  const totalAnnualEfkaEmployee = baseAnnualEfkaEmployee + bonusEfkaEmployee;
  const totalAnnualEfkaEmployer = baseAnnualEfkaEmployer + bonusEfkaEmployer;
  const totalAnnualTaxableIncome = totalAnnualGross - totalAnnualEfkaEmployee;
  const totalAnnualIncomeTax = calculateIncomeTax(totalAnnualTaxableIncome, children);

  const bonusIncomeTax = totalAnnualIncomeTax - baseAnnualIncomeTax;
  const totalDeductions = bonusEfkaEmployee + bonusIncomeTax;

  return {
    grossSalary: bonusGross,
    netSalary: bonusGross - totalDeductions,
    efkaEmployee: bonusEfkaEmployee,
    efkaEmployer: totalAnnualEfkaEmployer - baseAnnualEfkaEmployer,
    incomeTax: bonusIncomeTax,
    solidarityTax: 0,
    totalDeductions,
  };
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

export interface BonusLineBreakdown {
  gross: number;
  net: number;
  efkaEmployee: number;
  efkaEmployer: number;
  incomeTax: number;
  totalDeductions: number;
}

interface BonusCalculationResult {
  baseGross: number;
  vacationAddonGross: number;
  totalGross: number;
  daysInPeriod: number;
  periodDays: number;
}

interface VacationAllowanceCalculationResult {
  baseGross: number;
  totalGross: number;
  leaveDays: number;
}

export interface BonusBreakdown {
  easter: BonusLineBreakdown;
  christmas: BonusLineBreakdown;
  vacation: BonusLineBreakdown;
  totalGross: number;
  totalNet: number;
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
  totalGrossWithIncrements: number;
  baseMonthlyGross: number;
}

const roundTo2 = (value: number) => Math.round(value * 100) / 100;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function differenceInDaysInclusive(start: Date, end: Date): number {
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1;
}

function calculateEasterBonusGross(
  monthlyGross: number,
  referenceYear: number = new Date().getFullYear(),
  employmentStart?: Date,
  employmentEnd?: Date
): BonusCalculationResult {
  const periodStart = new Date(referenceYear, 0, 1);
  const periodEnd = new Date(referenceYear, 3, 30);
  const actualStart = employmentStart ? new Date(Math.max(employmentStart.getTime(), periodStart.getTime())) : periodStart;
  const effectiveEnd = employmentEnd ?? periodEnd;
  const actualEnd = new Date(Math.min(effectiveEnd.getTime(), periodEnd.getTime()));

  const daysInPeriod = actualEnd < actualStart ? 0 : differenceInDaysInclusive(actualStart, actualEnd);
  const periodDays = differenceInDaysInclusive(periodStart, periodEnd);
  const baseGross = roundTo2(0.5 * monthlyGross * clamp(daysInPeriod, 0, periodDays) / periodDays);
  const vacationAddonGross = roundTo2(baseGross * 0.041666);
  const totalGross = roundTo2(baseGross + vacationAddonGross);

  // Example sanity check (monthly-paid, 5-day, €1,725 from 1/1–31/12 with 20 leave days):
  // Easter gross should be close to half salary (~€862.50) with vacation addon near €35.94 for full period employment.

  return { baseGross, vacationAddonGross, totalGross, daysInPeriod, periodDays };
}

function calculateChristmasBonusGross(
  monthlyGross: number,
  referenceYear: number = new Date().getFullYear(),
  employmentStart?: Date,
  employmentEnd?: Date
): BonusCalculationResult {
  const periodStart = new Date(referenceYear, 4, 1);
  const periodEnd = new Date(referenceYear, 11, 31);
  const actualStart = employmentStart ? new Date(Math.max(employmentStart.getTime(), periodStart.getTime())) : periodStart;
  const effectiveEnd = employmentEnd ?? periodEnd;
  const actualEnd = new Date(Math.min(effectiveEnd.getTime(), periodEnd.getTime()));

  const daysInPeriod = actualEnd < actualStart ? 0 : differenceInDaysInclusive(actualStart, actualEnd);
  const periodDays = differenceInDaysInclusive(periodStart, periodEnd);
  const baseGross = roundTo2(1 * monthlyGross * clamp(daysInPeriod, 0, periodDays) / periodDays);
  const vacationAddonGross = roundTo2(baseGross * 0.041666);
  const totalGross = roundTo2(baseGross + vacationAddonGross);

  // Example sanity check (monthly-paid, 5-day, €1,725 from 1/1–31/12):
  // Christmas gross should be close to one salary (~€1,725) with vacation addon near €71.88 for full period employment.

  return { baseGross, vacationAddonGross, totalGross, daysInPeriod, periodDays };
}

function calculateVacationAllowanceGross(
  monthlyGross: number,
  leaveDays: number
): VacationAllowanceCalculationResult {
  const dailyWage = monthlyGross / 25;
  const vacationPay = dailyWage * leaveDays;
  const halfSalary = monthlyGross / 2;
  const baseGross = roundTo2(Math.min(vacationPay, halfSalary));

  // Example sanity check continuation: with 20 leave days and €1,725 monthly,
  // daily wage ~€69, leading to vacation allowance capped near half salary (~€862.50).

  return { baseGross, totalGross: baseGross, leaveDays };
}

export function calculateYearlySummary(
  salaries: { month: string; gross: number }[],
  children: number = 0,
  options?: { referenceYear?: number; leaveDays?: number; employmentStart?: Date; employmentEnd?: Date }
): YearlySummary {
  const totalRegularGross = salaries.reduce((sum, salary) => sum + salary.gross, 0);
  const monthsCount = salaries.length || 1;

  // Determine a representative base salary for bonuses by using the most frequent
  // monthly value (mode). This avoids inflating bonuses when occasional months
  // include overtime or other extras. In case of a tie, the lowest repeated value
  // is chosen to stay conservative.
  const occurrences = salaries.reduce((map, { gross }) => {
    const roundedGross = roundTo2(gross);
    map.set(roundedGross, (map.get(roundedGross) || 0) + 1);
    return map;
  }, new Map<number, number>());

  let baseMonthlyGross = totalRegularGross / monthsCount;
  if (occurrences.size > 0) {
    let maxCount = 0;
    let candidateGrosses: number[] = [];

    occurrences.forEach((count, gross) => {
      if (count > maxCount) {
        maxCount = count;
        candidateGrosses = [gross];
      } else if (count === maxCount) {
        candidateGrosses.push(gross);
      }
    });

    baseMonthlyGross = Math.min(...candidateGrosses);
  }
  const referenceYear = options?.referenceYear ?? new Date().getFullYear();
  const leaveDays = options?.leaveDays ?? 20;

  const easter = calculateEasterBonusGross(baseMonthlyGross, referenceYear, options?.employmentStart, options?.employmentEnd);
  const christmas = calculateChristmasBonusGross(baseMonthlyGross, referenceYear, options?.employmentStart, options?.employmentEnd);
  const vacation = calculateVacationAllowanceGross(baseMonthlyGross, leaveDays);

  const bonusGrossTotal = easter.totalGross + christmas.totalGross + vacation.totalGross;
  const totalGross = totalRegularGross + bonusGrossTotal;

  const totalEfkaEmployee = totalGross * EFKA_EMPLOYEE_RATE;
  const totalEfkaEmployer = totalGross * EFKA_EMPLOYER_RATE;
  const taxableIncome = totalGross - totalEfkaEmployee;
  const totalIncomeTax = calculateIncomeTax(taxableIncome, children);
  const totalSolidarityTax = SOLIDARITY_SUSPENDED ? 0 : calculateIncomeTax(taxableIncome, children);
  const totalDeductions = totalEfkaEmployee + totalIncomeTax + totalSolidarityTax;
  const totalNet = totalGross - totalDeductions;

  const buildLine = (gross: number): BonusLineBreakdown => {
    const efkaEmployee = gross * EFKA_EMPLOYEE_RATE;
    const efkaEmployer = gross * EFKA_EMPLOYER_RATE;
    const taxablePortion = taxableIncome > 0 ? (gross - efkaEmployee) / taxableIncome : 0;
    const incomeTaxShare = totalIncomeTax * taxablePortion;
    const net = gross - efkaEmployee - incomeTaxShare - (totalSolidarityTax * taxablePortion || 0);
    const totalLineDeductions = efkaEmployee + incomeTaxShare + (totalSolidarityTax * taxablePortion || 0);

    return {
      gross,
      net,
      efkaEmployee,
      efkaEmployer,
      incomeTax: incomeTaxShare,
      totalDeductions: totalLineDeductions,
    };
  };

  const monthlySalaries = salaries.map(({ month, gross }) => ({
    month,
    gross,
    net: buildLine(gross).net,
  }));

  const easterLine = buildLine(easter.totalGross);
  const christmasLine = buildLine(christmas.totalGross);
  const vacationLine = buildLine(vacation.totalGross);

  const bonusBreakdown: BonusBreakdown = {
    easter: easterLine,
    christmas: christmasLine,
    vacation: vacationLine,
    totalGross: bonusGrossTotal,
    totalNet: easterLine.net + christmasLine.net + vacationLine.net,
  };

  const simpleAnnualGross14 = baseMonthlyGross * 14;
  const totalGrossWithIncrements = totalGross;

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
    simpleAnnualGross14,
    totalGrossWithIncrements,
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
