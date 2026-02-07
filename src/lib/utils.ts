import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate time remaining until expiry
 */
export function getTimeRemaining(expiryTime: string): string {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Calculate expiry time based on preparation time (4 hours safety window)
 */
export function calculateExpiryTime(preparedTime: string): Date {
  const prepared = new Date(preparedTime);
  return new Date(prepared.getTime() + 4 * 60 * 60 * 1000);
}

/**
 * Format quantity with unit
 */
export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    reserved: 'bg-yellow-100 text-yellow-700',
    collected: 'bg-blue-100 text-blue-700',
    expired: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.available;
}
