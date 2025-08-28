import { modulo } from 'ol/math.js';
import { padNumber } from 'ol/string.js';
import { isNil } from './utils.js';

/**
 * Format coordinates to a template string.
 * @param coordinates with [x, y] in degrees.
 * @param template a template string containing "{x}" and/or "{y}" to format the result.
 * @param formatXFn a function to format the x coordinate into a string.
 * @param formatYFn a function to format the y coordinate into a string.
 * @returns the formated coordinates.
 */
export const coordinatesToTemplate = (
  coordinates: number[],
  template?: string,
  formatXFn?: (x: number) => string,
  formatYFn?: (y: number) => string,
): string => {
  template = template ?? '{x} {y}';
  formatXFn = formatXFn ?? ((x) => x.toString());
  formatYFn = formatYFn ?? ((y) => y.toString());
  const xStr = isNil(coordinates[0]) ? '' : formatXFn(coordinates[0]!);
  const yStr = isNil(coordinates[1]) ? '' : formatYFn(coordinates[1]!);
  return template.replace('{x}', xStr).replace('{y}', yStr);
};

/**
 * Format one coordinate (x or y) to DMS coordinate.
 * Example:
 * coordinateToDMS(7.1234, 'EW', 2) becomes 7° 07' 24.23" E
 * coordinateToDMS(46.1234, 'NS', 0) becomes 46° 43' 18 N
 * @param degrees the x or y coordinates in degree.
 * @param hemispheres NS or EW, the detection is automatic.
 * @param fractionDigits the precision to keep on the seconds. Default to 0.
 * @returns the formated coordinate.
 */
export const coordinateToDMS = (
  degrees: number,
  hemispheres: string,
  fractionDigits?: number,
): string => {
  fractionDigits = fractionDigits ?? 0;
  const normalizedDegrees = modulo(degrees + 180, 360) - 180;
  const dms = Math.abs(3600 * normalizedDegrees);
  const d = Math.floor(dms / 3600);
  const m = Math.floor((dms / 60) % 60);
  const s = dms % 60;
  return `${d}° ${padNumber(m, 2)}' ${padNumber(s, 2, fractionDigits)}" ${hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0)}`;
};

/**
 * Format coordinates to degree minutes seconds notation.
 * @param coordinates with [x, y] in degrees.
 * @param fractionDigits the precision to keep on the seconds. Default to 0.
 * @param template a template string containing "{x}" and/or "{y}" to format the result.
 * @returns the formated coordinates. Example: 46° 43' 18 N 7° 07' 24.23" E.
 */
export const coordinatesToDMSTemplate = (
  coordinates: number[],
  fractionDigits?: number,
  template?: string,
): string => {
  let formatXFn = (x: number) => coordinateToDMS(x, 'NS', fractionDigits ?? 0);
  const formatYFn = (y: number) => coordinateToDMS(y, 'EW', fractionDigits ?? 0);
  if (coordinates.length === 1) {
    formatXFn = (x: number) => coordinateToDMS(x, '  ', fractionDigits ?? 0);
  }
  return coordinatesToTemplate(
    [...coordinates].reverse(),
    template,
    formatXFn,
    formatYFn,
  );
};

/**
 * Format coordinates to a string in a given template and with given precision.
 * @param coordinates with [x, y] in degrees.
 * @param fractionDigits the precision to keep on the seconds defaults to 0.
 * @param template a template string containing "{x}" and/or "{y}" to format the result.
 * @returns the formated coordinates.
 */
export const coordinatesToNumberTemplate = (
  coordinates: number[],
  fractionDigits?: number,
  template?: string,
) => {
  const formatXFn = (x: number) => x.toFixed(fractionDigits ?? 0);
  const formatYFn = (y: number) => y.toFixed(fractionDigits ?? 0);
  return coordinatesToTemplate(coordinates, template, formatXFn, formatYFn);
};
