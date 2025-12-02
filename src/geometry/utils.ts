import OlGeomPoint from 'ol/geom/Point.js';
import OlGeomLine from 'ol/geom/LineString.js';
import OlGeomPolygon from 'ol/geom/Polygon.js';
import OlGeometry from 'ol/geom/Geometry.js';
import { getCenter } from 'ol/extent.js';

/**
 * Returns the center of a geometry.
 * Interior point of a polygon, center of a line, center of a point, or center of the geom extent.
 * @Returns the geographical center of a geometry.
 */
export const getGeometryCenter = (geom: OlGeometry): number[] => {
  if (geom instanceof OlGeomPolygon) {
    const interiorPoint = (geom as OlGeomPolygon).getInteriorPoint()?.getCoordinates();
    if (interiorPoint && interiorPoint.length >= 2) {
      return [interiorPoint[0]!, interiorPoint[1]!];
    }
  }
  if (geom instanceof OlGeomLine) {
    return (geom as OlGeomLine).getFlatMidpoint();
  }
  if (geom instanceof OlGeomPoint) {
    return (geom as OlGeomPoint).getCoordinates();
  }
  return getCenter(geom.getExtent());
};
