/**
 * Formatting utilities for SeblakPOS
 */

/**
 * Format a number as Indonesian Rupiah currency string.
 * @example formatRupiah(17500) → "Rp17.500"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
