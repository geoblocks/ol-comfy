import { describe, expect, it } from 'vitest';
import { isNil, overEvery, overSome, uniq } from './utils.js';

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

  const multiArgsFunc = (a: number, b: number) => (a + b) % 2 === 0;

  it('overEvery', () => {
    const func = overEvery([isFinite, Boolean]);
    expect(func('1')).toBeTruthy();
    expect(func(null)).toBeFalsy();
    expect(func(NaN)).toBeFalsy();

    const func2 = overEvery([isFinite, multiArgsFunc]);
    expect(func2(1, 2)).toBeFalsy();
    expect(func2(1, 3)).toBeTruthy();
  });

  it('overSome', () => {
    const func = overSome([isFinite, Boolean]);
    expect(func('1')).toBeTruthy();
    expect(func(null)).toBeTruthy();
    expect(func(NaN)).toBeFalsy();

    const func2 = overSome([isFinite, multiArgsFunc]);
    expect(func2(1, 2)).toBeTruthy();
    expect(func2(1, 3)).toBeTruthy();
  });
});
