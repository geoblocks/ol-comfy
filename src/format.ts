import { modulo } from 'ol/math.js';
import { padNumber } from 'ol/string.js';
import { isNil } from './utils.js';

/**
 * Format coordinates to a template string.
 * @param coordinates with [x, y] in degrees.
 * @param template a template string containing "{x}" and/or "{y}" to format the result.
 * @returns the formated coordinates.
 */
export const coordinatesToTemplate = (
  coordinates: (number | string)[],
  template?: string,
): string => {
  template = template ?? '{x} {y}';
  const xStr = coordinates[0] ? `${coordinates[0]}` : '';
  const yStr = coordinates[1] ? `${coordinates[1]}` : '';
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
 * @returns the formated coordinates.
 */
export const coordinatesToDMSTemplate = (
  coordinates: number[],
  fractionDigits?: number,
  template?: string,
): string => {
  const x = coordinates[0];
  const y = coordinates[1];
  const coordinatesDMS = [];
  if (!isNil(y)) {
    coordinatesDMS.push(coordinateToDMS(y!, 'NS', fractionDigits ?? 0));
  }
  if (!isNil(x)) {
    coordinatesDMS.push(coordinateToDMS(x!, 'EW', fractionDigits ?? 0));
  }
  return coordinatesToTemplate(coordinatesDMS, template);
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
  const x = coordinates[0];
  const y = coordinates[1];
  const xy = [];
  if (!isNil(x)) {
    xy.push(x!.toFixed(fractionDigits ?? 0));
  }
  if (!isNil(y)) {
    xy.push(y!.toFixed(fractionDigits ?? 0));
  }
  return coordinatesToTemplate(xy, template);
};
