import { describe, expect, it } from 'vitest';
import { isNil, uniq } from './utils.js';

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

  describe('array', () => {
    it('Returns uniq', () => {
      expect(uniq([0, 1, 2, 1, 2])).toEqual([0, 1, 2]);
      expect(uniq(['0', '1', '2', '1', '2'])).toEqual(['0', '1', '2']);
      expect(uniq([0, '1', '2', 1, '2', 1])).toEqual([0, '1', '2', 1]);
      expect(uniq([0, true, 'false', null, undefined, false, [], 1, 'false'])).toEqual([
        0,
        true,
        'false',
        null,
        undefined,
        false,
        [],
        1,
      ]);
      expect(uniq(['a', ' a', 'a ', 'A'])).toEqual(['a', ' a', 'a ', 'A']);
    });
  });
});
