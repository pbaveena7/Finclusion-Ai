/**
 * Format a number as Indian Rupees (INR)
 * @param value The number to format
 * @param maximumFractionDigits Number of decimal places (default 2)
 */
export const formatCurrency = (value: number, maximumFractionDigits = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value The number to format
 * @param showSign Whether to explicitly show '+' for positive numbers
 */
export const formatPercent = (value: number, showSign = true): string => {
  const prefix = showSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
};

/**
 * Format large numbers into shorthand (K, L, Cr)
 * @param value The number to format
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};
