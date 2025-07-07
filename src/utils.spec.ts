import { describe, expect, it } from 'vitest';
import { isNil } from './utils.js';

describe('utils', () => {
  describe('isNil', () => {
    it('should return true for null', () => {
      expect(isNil(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNil(undefined)).toBe(true);
    });

    it('should return false for a number', () => {
      expect(isNil(0)).toBe(false);
    });

    it('should return false for a string', () => {
      expect(isNil('')).toBe(false);
    });

    it('should return false for an object', () => {
      expect(isNil({})).toBe(false);
    });

    it('should return false for an array', () => {
      expect(isNil([])).toBe(false);
    });

    it('should return false for a boolean', () => {
      expect(isNil(false)).toBe(false);
    });
  });
});
