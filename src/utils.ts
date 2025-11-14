/**
 * Determines whether the given value is either `null` or `undefined`.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNil = (value: unknown): boolean => {
  return value === null || value === undefined;
};

/**
 * @returns a new array with unique values from the given array.
 */
export const uniq = <T>(values: T[]): T[] => {
  return Array.from(new Set(values));
};

/**
 * Returns a function that returns true if all the provided functions return true when invoked with the arguments it receives.
 */
export const overEvery = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functions: ((...args: any) => boolean)[],
): ((...args: T[]) => boolean) => {
  return (...args: T[]) =>
    functions.every((func) => {
      return func(...args);
    });
};

/**
 * Returns a function that returns true if at least one of the provided functions return true when invoked with the arguments it receives.
 */
export const overSome = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functions: ((...args: any) => boolean)[],
): ((...args: T[]) => boolean) => {
  return (...args: T[]) =>
    functions.some((func) => {
      return func(...args);
    });
};
