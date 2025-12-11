export function parseNumericExpression(value: string): number | null {
  if (!value) return null;

  const expr = value.replace(',', '.').trim();
  const safePattern = /^[0-9+\-*/().\s]+$/;

  const finalize = (num: number | null) => {
    if (num === null) return null;
    if (!Number.isFinite(num)) return null;
    return Math.round(num * 100) / 100;
  };

  if (safePattern.test(expr)) {
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr});`)();
      if (typeof result === 'number' && Number.isFinite(result)) {
        return finalize(result);
      }
    } catch {
      // fall through to basic float parsing below
    }
  }

  const parsed = Number.parseFloat(expr);
  return finalize(Number.isNaN(parsed) ? null : parsed);
}
