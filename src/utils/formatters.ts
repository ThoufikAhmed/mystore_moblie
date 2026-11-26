import { APP_CONFIG } from '../constants';

/**
 * Formats a numeric price to Indian Rupee (INR) format.
 * E.g., 1240 -> "₹1,240"
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return `${APP_CONFIG.currencySymbol}0`;
  }
  return `${APP_CONFIG.currencySymbol}${price.toLocaleString('en-IN')}`;
}

/**
 * Calculates discount percentage between original price and selling price.
 */
export function calculateDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Returns initials from a full name (e.g., "Thoufik Ahmed" -> "TA").
 */
export function getInitials(name: string): string {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generates an enterprise formatted order identifier.
 */
export function generateOrderId(): string {
  return `ORD${Math.floor(10000 + Math.random() * 90000)}`;
}
