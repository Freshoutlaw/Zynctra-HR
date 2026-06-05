/**
 * /frontend/src/utils/currencyFormatter.ts
 *
 * Currency formatting with locale and multi-currency support.
 */

export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatCompact = (
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);

export const parseCurrency = (formatted: string): number => {
  const cleaned = formatted.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

export const convertCurrency = (
  amount: number,
  fromRate: number,
  toRate: number
): number => (amount / fromRate) * toRate;

/** Return the ISO 4217 symbol for a currency code */
export const getCurrencySymbol = (currency: string, locale = 'en-US'): string => {
  try {
    return (
      new Intl.NumberFormat(locale, { style: 'currency', currency })
        .formatToParts(0)
        .find((p) => p.type === 'currency')?.value ?? currency
    );
  } catch {
    return currency;
  }
};

export default {
  formatCurrency,
  formatCompact,
  parseCurrency,
  convertCurrency,
  getCurrencySymbol,
};