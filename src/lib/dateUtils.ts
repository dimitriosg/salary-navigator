export function differenceInDaysInclusive(start: Date, end: Date): number {
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const diff = endTime - startTime;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function getDaysOverlap(start: Date, end: Date, hireDate: Date, asOf?: Date): number {
  const periodEnd = asOf ? new Date(asOf) : end;
  const overlapStart = new Date(Math.max(start.getTime(), hireDate.getTime()));
  const overlapEnd = new Date(Math.min(end.getTime(), periodEnd.getTime()));

  if (overlapEnd < overlapStart) return 0;

  return differenceInDaysInclusive(overlapStart, overlapEnd);
}

export function calculateServiceYears(hireDate: Date, asOf: Date): number {
  let years = asOf.getFullYear() - hireDate.getFullYear();
  const anniversaryThisYear = new Date(asOf.getFullYear(), hireDate.getMonth(), hireDate.getDate());

  if (asOf < anniversaryThisYear) {
    years -= 1;
  }

  return Math.max(0, years);
}
