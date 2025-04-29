import uniq from 'lodash/uniq.js';
import OlFeature from 'ol/Feature.js';
import { Geometry as OlGeometry } from 'ol/geom.js';
import OlGeomPoint from 'ol/geom/Point.js';
import OlGeomLine from 'ol/geom/LineString.js';
import OlGeomPolygon from 'ol/geom/Polygon.js';
import OlGeomCircle from 'ol/geom/Circle.js';
import {
  createEmpty as olCreateEmptyExtent,
  extend as olExtend,
  isEmpty as olIsEmpty,
  type Extent as OlExtent,
} from 'ol/extent.js';

/**
 * @param features the features to get the "properties" values from.
 * @param propertyKey the property key to get the value in the features.
 * @returns Distinct values of features for a given property's key.
 */
export const getDistinctFeaturesProperties = (
  features: OlFeature<OlGeometry>[],
  propertyKey: string,
): unknown[] => {
  return uniq(
    features.map((feature) => {
      return feature.get(propertyKey);
    }),
  );
};

/**
 * From points, create lines (0->1, 1->2, 2->3, etc.)
 * @param points points To create the line.
 * @param opt_onLineCreated Optional function to apply effect on each created
 * line.
 * @returns created lines from given points (0->1, 1->2, 2->3, etc.)
 */
export const getLinesBetweenPoints = (
  points: OlFeature<OlGeomPoint>[],
  opt_onLineCreated?: (
    line: OlFeature<OlGeomLine>,
    startPoint: OlFeature<OlGeomPoint>,
    endPoint: OlFeature<OlGeomPoint>,
  ) => void,
): OlFeature<OlGeomLine>[] => {
  const pointsShifted = Array.from(points.slice(1));
  return pointsShifted.map((_point, index) => {
    const startPoint = points[index]!;
    const endPoint = pointsShifted[index]!;
    const line = new OlFeature<OlGeomLine>({
      geometry: new OlGeomLine([
        startPoint.getGeometry()?.getCoordinates() || [],
        endPoint.getGeometry()?.getCoordinates() || [],
      ]),
    });
    if (opt_onLineCreated) {
      opt_onLineCreated(line, startPoint, endPoint);
    }
    return line;
  });
};

/**
 * @returns OlGeomPoint at the center of the given "area" geometry (circle
 * or polygon).
 */
export const getCenterOfArea = (geometry: OlGeomPolygon | OlGeomCircle): OlGeomPoint => {
  if (geometry instanceof OlGeomPolygon) {
    return geometry.getInteriorPoint();
  }
  return new OlGeomPoint(geometry.getCenter());
};

/**
 * @returns The extent (not empty) of all given features.
 */
export const getFeaturesExtent = (features: OlFeature<OlGeometry>[]): OlExtent | null => {
  const extent =
    features.reduce(
      (currentExtent, feature) =>
        olExtend(currentExtent, feature.getGeometry()?.getExtent() ?? []),
      olCreateEmptyExtent(),
    ) ?? null;
  return extent && !olIsEmpty(extent) ? extent : null;
};
