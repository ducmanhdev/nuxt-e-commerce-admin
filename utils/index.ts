/**
 * Formats a number as a currency string.
 * @param amount - The amount to format.
 * @param currency - The currency code (e.g., 'USD', 'EUR', 'VND').
 * @param locale - The locale for formatting (default is 'en-US').
 * @param minimumFractionDigits - Minimum decimal places (default is 2).
 * @returns A string formatted as currency.
 */
export const formatMoney = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  minimumFractionDigits: number = 2,
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount)
