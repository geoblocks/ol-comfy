import { expect, it, describe } from 'vitest';
import { getGeometryCenter } from './utils.js';
import OlGeomPolygon from 'ol/geom/Polygon.js';
import OlGeomCircle from 'ol/geom/Circle.js';
import OlGeomLine from 'ol/geom/LineString.js';
import OlGeomPoint from 'ol/geom/Point.js';
import OlGeomMultiPoint from 'ol/geom/MultiPoint.js';

describe('geometry utils', () => {
  it('getGeometryCenter', () => {
    expect(getGeometryCenter(new OlGeomPoint([0, 0]))).toEqual([0, 0]);
    expect(getGeometryCenter(new OlGeomCircle([2, -3], 5))).toEqual([2, -3]);
    expect(
      getGeometryCenter(
        new OlGeomLine([
          [0, 0],
          [2, 2],
        ]),
      ),
    ).toEqual([1, 1]);
    expect(
      getGeometryCenter(
        new OlGeomPolygon([
          [
            [0, 0],
            [0, 2],
            [2, 2],
            [2, 0],
            [0, 0],
          ],
        ]),
      ),
    ).toEqual([1, 1]);
    expect(
      getGeometryCenter(
        new OlGeomMultiPoint([
          [0, 0],
          [2, 2],
        ]),
      ),
    ).toEqual([1, 1]);
  });
});
