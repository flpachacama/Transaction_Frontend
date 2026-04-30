"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../../src/utils/validation");
describe('Validation Utils', () => {
    describe('validateId', () => {
        it('should pass for valid ID (3-10 chars)', () => {
            expect((0, validation_1.validateId)('p123').valid).toBe(true);
            expect((0, validation_1.validateId)('product').valid).toBe(true);
            expect((0, validation_1.validateId)('1234567890').valid).toBe(true);
        });
        it('should fail for empty ID', () => {
            const result = (0, validation_1.validateId)('');
            expect(result.valid).toBe(false);
            expect(result.error).toContain('required');
        });
        it('should fail for ID < 3 chars', () => {
            expect((0, validation_1.validateId)('ab').valid).toBe(false);
            expect((0, validation_1.validateId)('ab').error).toContain('at least 3');
        });
        it('should fail for ID > 10 chars', () => {
            expect((0, validation_1.validateId)('12345678901').valid).toBe(false);
            expect((0, validation_1.validateId)('12345678901').error).toContain('at most 10');
        });
    });
    describe('validateName', () => {
        it('should pass for valid name (5-100 chars)', () => {
            expect((0, validation_1.validateName)('Valid').valid).toBe(true);
            expect((0, validation_1.validateName)('A'.repeat(100)).valid).toBe(true);
        });
        it('should fail for name < 5 chars', () => {
            expect((0, validation_1.validateName)('Abc').valid).toBe(false);
            expect((0, validation_1.validateName)('Abc').error).toContain('at least 5');
        });
        it('should fail for name > 100 chars', () => {
            expect((0, validation_1.validateName)('A'.repeat(101)).valid).toBe(false);
            expect((0, validation_1.validateName)('A'.repeat(101)).error).toContain('at most 100');
        });
        it('should fail for empty name', () => {
            expect((0, validation_1.validateName)('').valid).toBe(false);
        });
    });
    describe('validateDescription', () => {
        it('should pass for valid description (10-200 chars)', () => {
            expect((0, validation_1.validateDescription)('1234567890').valid).toBe(true);
            expect((0, validation_1.validateDescription)('A'.repeat(200)).valid).toBe(true);
        });
        it('should fail for description < 10 chars', () => {
            expect((0, validation_1.validateDescription)('Short').valid).toBe(false);
            expect((0, validation_1.validateDescription)('Short').error).toContain('at least 10');
        });
        it('should fail for description > 200 chars', () => {
            expect((0, validation_1.validateDescription)('A'.repeat(201)).valid).toBe(false);
            expect((0, validation_1.validateDescription)('A'.repeat(201)).error).toContain('at most 200');
        });
    });
    describe('validateLogo', () => {
        it('should pass for any non-empty logo', () => {
            expect((0, validation_1.validateLogo)('logo.png').valid).toBe(true);
            expect((0, validation_1.validateLogo)('http://example.com/image.jpg').valid).toBe(true);
        });
        it('should fail for empty logo', () => {
            expect((0, validation_1.validateLogo)('').valid).toBe(false);
            expect((0, validation_1.validateLogo)('').error).toContain('required');
        });
    });
    describe('validateDateRelease', () => {
        it('should pass for today or future dates', () => {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            expect((0, validation_1.validateDateRelease)(today).valid).toBe(true);
            expect((0, validation_1.validateDateRelease)(tomorrow).valid).toBe(true);
        });
        it('should fail for past dates', () => {
            const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            expect((0, validation_1.validateDateRelease)(yesterday).valid).toBe(false);
            expect((0, validation_1.validateDateRelease)(yesterday).error).toContain('today or in the future');
        });
        it('should fail for invalid date format', () => {
            expect((0, validation_1.validateDateRelease)('not-a-date').valid).toBe(false);
            expect((0, validation_1.validateDateRelease)('not-a-date').error).toContain('Invalid date format');
        });
        it('should fail for empty date', () => {
            expect((0, validation_1.validateDateRelease)('').valid).toBe(false);
        });
    });
    describe('calculateDateRevision', () => {
        it('should add 1 year to release date', () => {
            const releaseDate = '2024-05-15';
            const revision = (0, validation_1.calculateDateRevision)(releaseDate);
            expect(revision).toBe('2025-05-15');
        });
        it('should handle leap years', () => {
            const releaseDate = '2024-02-29'; // leap year
            const revision = (0, validation_1.calculateDateRevision)(releaseDate);
            expect(revision).toBe('2025-02-28'); // 2025 is not a leap year
        });
        it('should work for year-end dates', () => {
            const releaseDate = '2024-12-31';
            const revision = (0, validation_1.calculateDateRevision)(releaseDate);
            expect(revision).toBe('2025-12-31');
        });
    });
    describe('validateForm', () => {
        const validFormData = {
            id: 'p123',
            name: 'Valid Product',
            description: 'This is a valid description',
            logo: 'logo.png',
            date_release: new Date().toISOString().split('T')[0],
        };
        it('should pass for valid complete form', () => {
            const result = (0, validation_1.validateForm)(validFormData);
            expect(result.valid).toBe(true);
            expect(Object.keys(result.errors)).toHaveLength(0);
        });
        it('should collect multiple errors', () => {
            const result = (0, validation_1.validateForm)({
                id: 'ab',
                name: 'abc',
                description: 'short',
                logo: '',
                date_release: 'invalid', // invalid
            });
            expect(result.valid).toBe(false);
            expect(Object.keys(result.errors).length).toBeGreaterThan(1);
            expect(result.errors.id).toBeDefined();
            expect(result.errors.name).toBeDefined();
            expect(result.errors.description).toBeDefined();
            expect(result.errors.logo).toBeDefined();
            expect(result.errors.date_release).toBeDefined();
        });
        it('should return empty errors for valid form', () => {
            const result = (0, validation_1.validateForm)(validFormData);
            expect(result.errors).toEqual({});
        });
    });
});
