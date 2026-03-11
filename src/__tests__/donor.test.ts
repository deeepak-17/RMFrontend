import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatDate,
    getTimeRemaining,
    calculateExpiryTime,
    formatQuantity,
    getStatusColor,
} from '../lib/utils';

/**
 * Donor-workflow specific tests
 * These tests focus on the utility functions as used in the donor module:
 * - Donation status display (getStatusColor)
 * - Expiry calculation (calculateExpiryTime, getTimeRemaining)
 * - Quantity formatting as produced by the backend (formatQuantity)
 * - Date formatting for donation cards (formatDate)
 */
describe('Donor Workflow Utilities', () => {
    // ─── Donation Status Colors ──────────────────────────────────────
    describe('getStatusColor — donor workflow statuses', () => {
        it('should show green for available donations (ready to claim)', () => {
            expect(getStatusColor('available')).toBe('bg-green-100 text-green-700');
        });

        it('should show yellow for reserved donations (NGO claimed)', () => {
            expect(getStatusColor('reserved')).toBe('bg-yellow-100 text-yellow-700');
        });

        it('should show blue for collected donations (picked up)', () => {
            expect(getStatusColor('collected')).toBe('bg-blue-100 text-blue-700');
        });

        it('should show red for expired donations (past 4-hour window)', () => {
            expect(getStatusColor('expired')).toBe('bg-red-100 text-red-700');
        });

        it('should default to available color for unknown/undefined status', () => {
            expect(getStatusColor('pending')).toBe('bg-green-100 text-green-700');
            expect(getStatusColor('')).toBe('bg-green-100 text-green-700');
        });
    });

    // ─── Expiry Calculation (4-hour safety window per PRD) ──────────
    describe('calculateExpiryTime — 4-hour food safety window', () => {
        it('should add exactly 4 hours to prepared time', () => {
            const prepared = '2026-01-15T10:00:00Z';
            const expiry = calculateExpiryTime(prepared);
            expect(expiry.toISOString()).toBe('2026-01-15T14:00:00.000Z');
        });

        it('should handle midnight crossing correctly', () => {
            const prepared = '2026-01-15T22:00:00Z';
            const expiry = calculateExpiryTime(prepared);
            expect(expiry.toISOString()).toBe('2026-01-16T02:00:00.000Z');
        });

        it('should return a Date object', () => {
            const expiry = calculateExpiryTime('2026-06-01T08:00:00Z');
            expect(expiry).toBeInstanceOf(Date);
        });

        it('should handle end-of-year crossing', () => {
            const prepared = '2026-12-31T22:30:00Z';
            const expiry = calculateExpiryTime(prepared);
            expect(expiry.toISOString()).toBe('2027-01-01T02:30:00.000Z');
        });

        it('should produce a time 4 hours in the future from any prepared time', () => {
            const prepared = new Date('2026-03-10T06:15:00Z');
            const expiry = calculateExpiryTime(prepared.toISOString());
            const diffMs = expiry.getTime() - prepared.getTime();
            expect(diffMs).toBe(4 * 60 * 60 * 1000); // exactly 4 hours in ms
        });
    });

    // ─── Time Remaining Display ──────────────────────────────────────
    describe('getTimeRemaining — expiry countdown display', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should show Expired for a donation past its expiry', () => {
            expect(getTimeRemaining('2026-01-15T08:00:00Z')).toBe('Expired');
        });

        it('should show hours and minutes for a donation with time remaining', () => {
            expect(getTimeRemaining('2026-01-15T15:30:00Z')).toBe('3h 30m');
        });

        it('should show only minutes when less than 1 hour remains', () => {
            expect(getTimeRemaining('2026-01-15T12:45:00Z')).toBe('45m');
        });

        it('should show Expired for exactly current time (0 diff)', () => {
            expect(getTimeRemaining('2026-01-15T12:00:00Z')).toBe('Expired');
        });

        it('should handle a full 4-hour window (newly created donation)', () => {
            expect(getTimeRemaining('2026-01-15T16:00:00Z')).toBe('4h 0m');
        });
    });

    // ─── Quantity Formatting ─────────────────────────────────────────
    describe('formatQuantity — as produced by backend (quantity + unit)', () => {
        it('should format integer quantity with unit', () => {
            expect(formatQuantity(10, 'plates')).toBe('10 plates');
        });

        it('should format decimal quantity (e.g. 2.5 kg)', () => {
            expect(formatQuantity(2.5, 'kg')).toBe('2.5 kg');
        });

        it('should handle zero quantity', () => {
            expect(formatQuantity(0, 'servings')).toBe('0 servings');
        });

        it('should handle large quantities (event-scale donations)', () => {
            expect(formatQuantity(500, 'meals')).toBe('500 meals');
        });

        it('should handle single-item donations', () => {
            expect(formatQuantity(1, 'tray')).toBe('1 tray');
        });
    });

    // ─── Date Formatting ─────────────────────────────────────────────
    describe('formatDate — donation card display', () => {
        it('should return a non-empty string for a valid ISO date', () => {
            const result = formatDate('2026-01-15T10:30:00Z');
            expect(result).toBeTruthy();
            expect(typeof result).toBe('string');
        });

        it('should include the year in the formatted output', () => {
            const result = formatDate('2026-06-20T14:30:00Z');
            expect(result).toMatch(/2026/);
        });

        it('should handle date-only strings', () => {
            const result = formatDate('2026-01-01');
            expect(result).toBeTruthy();
        });

        it('should return "Invalid Date" for bad input', () => {
            const result = formatDate('not-a-date');
            expect(result).toContain('Invalid');
        });
    });
});
