import { describe, it, expect } from 'vitest';
import { isValidHexColor } from './themeUtils';

describe('themeUtils - CSS/Color validation', () => {
    it('should validate 6-digit hex code', () => {
        expect(isValidHexColor('#ffffff')).toBe(true);
        expect(isValidHexColor('#123456')).toBe(true);
        expect(isValidHexColor('#ABCDEF')).toBe(true);
    });

    it('should validate 3-digit hex code', () => {
        expect(isValidHexColor('#fff')).toBe(true);
        expect(isValidHexColor('#123')).toBe(true);
    });

    it('should reject invalid hex codes', () => {
        expect(isValidHexColor('#fffffff')).toBe(false); // 7 digits
        expect(isValidHexColor('123456')).toBe(false); // missing #
        expect(isValidHexColor('#12G')).toBe(false); // invalid chars
        expect(isValidHexColor('')).toBe(false); // empty
        expect(isValidHexColor(null)).toBe(false); // null
        expect(isValidHexColor(undefined)).toBe(false); // undefined
    });
});
