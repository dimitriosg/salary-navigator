import { calculateServiceYears } from './dateUtils';

type WeekType = '5' | '6';

const entitlement5Day = {
  firstYear: 20,
  secondYear: 21,
  thirdToTenth: 22,
  longService: 25,
};

const entitlement6Day = {
  firstYear: 24,
  secondYear: 25,
  thirdToTenth: 26,
  longService: 30,
};

function getMonthsWorkedInYear(hireDate: Date, asOf: Date): number {
  if (hireDate > asOf) return 0;
  if (hireDate.getFullYear() !== asOf.getFullYear()) return 12;

  let months = asOf.getMonth() - hireDate.getMonth();
  if (asOf.getDate() >= hireDate.getDate()) {
    months += 1;
  }

  return Math.min(12, Math.max(0, months));
}

export function calculateAnnualLeaveDays(
  hireDate: Date,
  asOf: Date,
  weekType: WeekType,
  prorateFirstYear: boolean = true
): number {
  const entitlement = weekType === '6' ? entitlement6Day : entitlement5Day;
  const serviceYears = calculateServiceYears(hireDate, asOf);
  const monthsWorkedInYear = getMonthsWorkedInYear(hireDate, asOf);

  if (hireDate.getFullYear() === asOf.getFullYear()) {
    if (!prorateFirstYear) {
      const adjustedYears = Math.max(1, serviceYears);
      if (adjustedYears === 1) return entitlement.secondYear;
      if (adjustedYears < 10) return entitlement.thirdToTenth;
      return entitlement.longService;
    }
    return (entitlement.firstYear * monthsWorkedInYear) / 12;
  }

  if (serviceYears === 1) {
    return entitlement.secondYear;
  }

  if (serviceYears < 10) {
    return entitlement.thirdToTenth;
  }

  return entitlement.longService;
}
