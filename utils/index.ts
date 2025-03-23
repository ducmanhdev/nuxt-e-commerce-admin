/**
 * Formats a number as a currency string.
 * @param amount - The amount to format.
 * @param currency - The currency code (e.g., 'USD', 'EUR', 'VND').
 * @param locale - The locale for formatting (default is 'en-US').
 * @param minimumFractionDigits - Minimum decimal places (default is 2).
 * @returns A string formatted as currency.
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  minimumFractionDigits: number = 2,
): string => {
  if (Number.isNaN(amount)) {
    return 'NaN'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
  }).format(amount)
}

/**
 * Converts bytes to megabytes.
 * @param bytes - The number of bytes to convert.
 * @returns The equivalent megabytes, rounded to 2 decimal places.
 */
export const bytesToMB = (bytes: number): number => {
  return Number((bytes / (1024 * 1024)).toFixed(2))
}

/**
 * Converts megabytes to bytes.
 * @param megabytes - The number of megabytes to convert.
 * @returns The equivalent bytes.
 */
export const MBToBytes = (megabytes: number): number => {
  return megabytes * (1024 * 1024)
}
