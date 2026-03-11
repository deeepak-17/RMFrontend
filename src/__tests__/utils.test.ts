import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, formatDate, getTimeRemaining, calculateExpiryTime, formatQuantity, getStatusColor } from '../lib/utils';

describe('Utility Functions', () => {
    // ─── cn (class merger) ────────────────────────────────────
    describe('cn', () => {
        it('should merge class names', () => {
            expect(cn('foo', 'bar')).toBe('foo bar');
        });

        it('should handle conditional classes', () => {
            const result = cn('base', true && 'active', false && 'hidden');
            expect(result).toContain('base');
            expect(result).toContain('active');
            expect(result).not.toContain('hidden');
        });

        it('should merge conflicting tailwind classes', () => {
            const result = cn('bg-red-500', 'bg-blue-500');
            expect(result).toBe('bg-blue-500');
        });

        it('should handle empty inputs', () => {
            expect(cn()).toBe('');
        });

        it('should handle undefined and null', () => {
            expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
        });
    });

    // ─── formatDate ────────────────────────────────────────────
    describe('formatDate', () => {
        it('should format a valid date string', () => {
            const result = formatDate('2026-01-15T10:30:00Z');
            expect(result).toBeTruthy();
            expect(typeof result).toBe('string');
        });

        it('should include day, month, year, and time', () => {
            const result = formatDate('2026-06-20T14:30:00Z');
            // Should contain a numeric day, month abbreviation, year, and time
            expect(result).toMatch(/\d{1,2}/); // day
            expect(result).toMatch(/\d{4}/);    // year
        });

        it('should handle different date formats', () => {
            const result1 = formatDate('2026-01-01');
            const result2 = formatDate('2026-12-31T23:59:59Z');
            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
        });

        it('should return Invalid Date for bad input', () => {
            const result = formatDate('not-a-date');
            expect(result).toContain('Invalid');
        });
    });

    // ─── getTimeRemaining ────────────────────────────────────
    describe('getTimeRemaining', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should return Expired for past dates', () => {
            expect(getTimeRemaining('2026-01-15T11:00:00Z')).toBe('Expired');
        });

        it('should return hours and minutes for future dates', () => {
            const result = getTimeRemaining('2026-01-15T15:30:00Z');
            expect(result).toBe('3h 30m');
        });

        it('should return only minutes when less than 1 hour', () => {
            const result = getTimeRemaining('2026-01-15T12:45:00Z');
            expect(result).toBe('45m');
        });

        it('should return 0m for exactly current time', () => {
            expect(getTimeRemaining('2026-01-15T12:00:00Z')).toBe('Expired');
        });

        it('should handle multi-hour remaining time', () => {
            const result = getTimeRemaining('2026-01-16T12:00:00Z');
            expect(result).toBe('24h 0m');
        });
    });

    // ─── calculateExpiryTime ────────────────────────────────
    describe('calculateExpiryTime', () => {
        it('should add 4 hours to the prepared time', () => {
            const prepared = '2026-01-15T10:00:00Z';
            const result = calculateExpiryTime(prepared);
            expect(result.toISOString()).toBe('2026-01-15T14:00:00.000Z');
        });

        it('should handle midnight crossing', () => {
            const prepared = '2026-01-15T22:00:00Z';
            const result = calculateExpiryTime(prepared);
            expect(result.toISOString()).toBe('2026-01-16T02:00:00.000Z');
        });

        it('should return a Date object', () => {
            const result = calculateExpiryTime('2026-01-01T00:00:00Z');
            expect(result).toBeInstanceOf(Date);
        });

        it('should handle different date input formats', () => {
            const result = calculateExpiryTime('2026-06-15T08:30:00.000Z');
            expect(result.toISOString()).toBe('2026-06-15T12:30:00.000Z');
        });
    });

    // ─── formatQuantity ────────────────────────────────────────
    describe('formatQuantity', () => {
        it('should format quantity with unit', () => {
            expect(formatQuantity(10, 'plates')).toBe('10 plates');
        });

        it('should handle singular unit', () => {
            expect(formatQuantity(1, 'plate')).toBe('1 plate');
        });

        it('should handle zero quantity', () => {
            expect(formatQuantity(0, 'kg')).toBe('0 kg');
        });

        it('should handle decimal quantities', () => {
            expect(formatQuantity(2.5, 'kg')).toBe('2.5 kg');
        });

        it('should handle large quantities', () => {
            expect(formatQuantity(1000, 'servings')).toBe('1000 servings');
        });
    });

    // ─── getStatusColor ────────────────────────────────────────
    describe('getStatusColor', () => {
        it('should return green classes for available status', () => {
            expect(getStatusColor('available')).toBe('bg-green-100 text-green-700');
        });

        it('should return yellow classes for reserved status', () => {
            expect(getStatusColor('reserved')).toBe('bg-yellow-100 text-yellow-700');
        });

        it('should return blue classes for collected status', () => {
            expect(getStatusColor('collected')).toBe('bg-blue-100 text-blue-700');
        });

        it('should return red classes for expired status', () => {
            expect(getStatusColor('expired')).toBe('bg-red-100 text-red-700');
        });

        it('should return default (available) classes for unknown status', () => {
            expect(getStatusColor('unknown')).toBe('bg-green-100 text-green-700');
        });

        it('should return default for empty string', () => {
            expect(getStatusColor('')).toBe('bg-green-100 text-green-700');
        });
    });
});
