/**
 * Determines whether the given value is either `null` or `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNil = (value: unknown): boolean => {
  return value === null || value === undefined;
};
