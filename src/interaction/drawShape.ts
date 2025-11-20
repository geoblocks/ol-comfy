import type { Options } from 'ol/interaction/Draw.js';
import olGeomPolygon from 'ol/geom/Polygon.js';

/**
 * @returns Drawing options to draw a box.
 */
export const getDrawBoxOptions = (): Options => {
  return {
    type: 'LineString',
    maxPoints: 2,
    geometryFunction: (coordinates, geometry) => {
      if (!geometry) {
        geometry = new olGeomPolygon([]);
      }
      const start = coordinates[0] as number[];
      const end = coordinates[1] as number[];
      if (!Array.isArray(start) || !Array.isArray(end)) {
        console.error('Wrong coordinates type');
        return geometry;
      }
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start],
      ]);
      return geometry;
    },
  };
};
