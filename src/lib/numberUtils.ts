export function parseNumericExpression(value: string): number | null {
  if (!value) return null;

  const expr = value.replace(',', '.').trim();
  const safePattern = /^[0-9+\-*/().\s]+$/;
  if (!safePattern.test(expr)) {
    return null;
  }

  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr});`)();
    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return null;
    }
    return result;
  } catch {
    return null;
  }
}
