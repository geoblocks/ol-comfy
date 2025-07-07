import { Subject } from 'rxjs';
import OlMap from 'ol/Map.js';
import { isNil } from '../utils.js';

/**
 * @returns A projection distance from a number of pixels (from [0, 0] ->
 * could be imprecise);
 */
export const getDistanceFromAmountOfPixel = (
  map: OlMap,
  numberOfPixel: number,
): number => {
  const coord1 = map.getCoordinateFromPixel([0, 0]);
  if (isNil(coord1)) {
    return 0;
  }
  const coord2 = map.getCoordinateFromPixel([numberOfPixel, 0]);
  if (coord1[0] === undefined || coord2[0] === undefined) {
    return 0;
  }
  return Math.abs(coord1[0] - coord2[0]);
};

/**
 * @returns An observable stored in the map and created by Ol-Comfy.
 */
export const getObservable = (
  map: OlMap,
  observableUid: string,
): Subject<unknown> | undefined => {
  return map.get(observableUid);
};
