import { l as lineStringsCoordinateAtM, i as interpolatePoint, c as linearRingss$1, V as VectorSource, F as Feature } from "./Vector-D1eER0Rr.js";
import { a1 as Geometry, K as unlistenByKey, L as listen, E as EventType, a2 as closestSquaredDistanceXY, a3 as createOrUpdateEmpty, a4 as extend, a5 as getCenter, a6 as SimpleGeometry, a7 as extend$1, a8 as arrayMaxSquaredDelta, a9 as assignClosestArrayPoint, aa as inflateCoordinatesArray, ab as lineStringLength, ac as douglasPeuckerArray, ad as intersectsLineStringArray, ae as deflateCoordinatesArray, af as squaredDistance, ag as inflateCoordinates, l as Point, ah as containsXY, ai as deflateCoordinates, aj as multiArrayMaxSquaredDelta, ak as assignClosestMultiArrayPoint, al as linearRingssContainsXY, am as linearRingss, an as orientLinearRingsArray, ao as inflateMultiCoordinatesArray, ap as getInteriorPointsOfMultiArray, aq as linearRingssAreOriented, ar as quantizeMultiArray, P as Polygon, as as intersectsLinearRingMultiArray, at as deflateMultiCoordinatesArray, q as distance, au as toFixed, av as clamp, c as PointerInteraction, F as FALSE, d as TRUE, f as fromUserCoordinate, x as squaredDistance$1, V as VectorLayer, aw as noModifierKeys, e as always, ax as shiftKeyOnly, I as InteractionProperty, m as MapBrowserEventType, ay as MapBrowserEvent, j as boundingExtent, az as getStrideForLayout, z as never, A as createEditingStyle, g as BaseEvent } from "./overlay-layer-group-BTOISlhP.js";
import { L as LineString, C as Circle } from "./LineString-DRa7gE46.js";
class GeometryCollection extends Geometry {
  /**
   * @param {Array<Geometry>} geometries Geometries.
   */
  constructor(geometries) {
    super();
    this.geometries_ = geometries;
    this.changeEventsKeys_ = [];
    this.listenGeometriesChange_();
  }
  /**
   * @private
   */
  unlistenGeometriesChange_() {
    this.changeEventsKeys_.forEach(unlistenByKey);
    this.changeEventsKeys_.length = 0;
  }
  /**
   * @private
   */
  listenGeometriesChange_() {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      this.changeEventsKeys_.push(
        listen(geometries[i], EventType.CHANGE, this.changed, this)
      );
    }
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!GeometryCollection} Clone.
   * @api
   * @override
   */
  clone() {
    const geometryCollection = new GeometryCollection(
      cloneGeometries(this.geometries_)
    );
    geometryCollection.applyProperties(this);
    return geometryCollection;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      minSquaredDistance = geometries[i].closestPointXY(
        x,
        y,
        closestPoint,
        minSquaredDistance
      );
    }
    return minSquaredDistance;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(x, y) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].containsXY(x, y)) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(extent) {
    createOrUpdateEmpty(extent);
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      extend(extent, geometries[i].getExtent());
    }
    return extent;
  }
  /**
   * Return the geometries that make up this geometry collection.
   * @return {Array<Geometry>} Geometries.
   * @api
   */
  getGeometries() {
    return cloneGeometries(this.geometries_);
  }
  /**
   * @return {Array<Geometry>} Geometries.
   */
  getGeometriesArray() {
    return this.geometries_;
  }
  /**
   * @return {Array<Geometry>} Geometries.
   */
  getGeometriesArrayRecursive() {
    let geometriesArray = [];
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].getType() === this.getType()) {
        geometriesArray = geometriesArray.concat(
          /** @type {GeometryCollection} */
          geometries[i].getGeometriesArrayRecursive()
        );
      } else {
        geometriesArray.push(geometries[i]);
      }
    }
    return geometriesArray;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {GeometryCollection} Simplified GeometryCollection.
   * @override
   */
  getSimplifiedGeometry(squaredTolerance) {
    if (this.simplifiedGeometryRevision !== this.getRevision()) {
      this.simplifiedGeometryMaxMinSquaredTolerance = 0;
      this.simplifiedGeometryRevision = this.getRevision();
    }
    if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) {
      return this;
    }
    const simplifiedGeometries = [];
    const geometries = this.geometries_;
    let simplified = false;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      const geometry = geometries[i];
      const simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
      simplifiedGeometries.push(simplifiedGeometry);
      if (simplifiedGeometry !== geometry) {
        simplified = true;
      }
    }
    if (simplified) {
      const simplifiedGeometryCollection = new GeometryCollection(
        simplifiedGeometries
      );
      return simplifiedGeometryCollection;
    }
    this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
    return this;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "GeometryCollection";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(extent) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      if (geometries[i].intersectsExtent(extent)) {
        return true;
      }
    }
    return false;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.geometries_.length === 0;
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(angle, anchor) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].rotate(angle, anchor);
    }
    this.changed();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   * @override
   */
  scale(sx, sy, anchor) {
    if (!anchor) {
      anchor = getCenter(this.getExtent());
    }
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].scale(sx, sy, anchor);
    }
    this.changed();
  }
  /**
   * Set the geometries that make up this geometry collection.
   * @param {Array<Geometry>} geometries Geometries.
   * @api
   */
  setGeometries(geometries) {
    this.setGeometriesArray(cloneGeometries(geometries));
  }
  /**
   * @param {Array<Geometry>} geometries Geometries.
   */
  setGeometriesArray(geometries) {
    this.unlistenGeometriesChange_();
    this.geometries_ = geometries;
    this.listenGeometriesChange_();
    this.changed();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   * @override
   */
  applyTransform(transformFn) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].applyTransform(transformFn);
    }
    this.changed();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   * @override
   */
  translate(deltaX, deltaY) {
    const geometries = this.geometries_;
    for (let i = 0, ii = geometries.length; i < ii; ++i) {
      geometries[i].translate(deltaX, deltaY);
    }
    this.changed();
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.unlistenGeometriesChange_();
    super.disposeInternal();
  }
}
function cloneGeometries(geometries) {
  return geometries.map((geometry) => geometry.clone());
}
class MultiLineString extends SimpleGeometry {
  /**
   * @param {Array<Array<import("../coordinate.js").Coordinate>|LineString>|Array<number>} coordinates
   *     Coordinates or LineString geometries. (For internal use, flat coordinates in
   *     combination with `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Flat coordinate ends for internal use.
   */
  constructor(coordinates, layout, ends) {
    super();
    this.ends_ = [];
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    if (Array.isArray(coordinates[0])) {
      this.setCoordinates(
        /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
        coordinates,
        layout
      );
    } else if (layout !== void 0 && ends) {
      this.setFlatCoordinates(
        layout,
        /** @type {Array<number>} */
        coordinates
      );
      this.ends_ = ends;
    } else {
      const lineStrings = (
        /** @type {Array<LineString>} */
        coordinates
      );
      const flatCoordinates = [];
      const ends2 = [];
      for (let i = 0, ii = lineStrings.length; i < ii; ++i) {
        const lineString = lineStrings[i];
        extend$1(flatCoordinates, lineString.getFlatCoordinates());
        ends2.push(flatCoordinates.length);
      }
      const layout2 = lineStrings.length === 0 ? this.getLayout() : lineStrings[0].getLayout();
      this.setFlatCoordinates(layout2, flatCoordinates);
      this.ends_ = ends2;
    }
  }
  /**
   * Append the passed linestring to the multilinestring.
   * @param {LineString} lineString LineString.
   * @api
   */
  appendLineString(lineString) {
    extend$1(this.flatCoordinates, lineString.getFlatCoordinates().slice());
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiLineString} Clone.
   * @api
   * @override
   */
  clone() {
    const multiLineString = new MultiLineString(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    multiLineString.applyProperties(this);
    return multiLineString;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        arrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.ends_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestArrayPoint(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      false,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * `interpolate` controls interpolation between consecutive LineStrings
   * within the MultiLineString. If `interpolate` is `true` the coordinates
   * will be linearly interpolated between the last coordinate of one LineString
   * and the first coordinate of the next LineString.  If `interpolate` is
   * `false` then the function will return `null` for Ms falling between
   * LineStrings.
   *
   * @param {number} m M.
   * @param {boolean} [extrapolate] Extrapolate. Default is `false`.
   * @param {boolean} [interpolate] Interpolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate|null} Coordinate.
   * @api
   */
  getCoordinateAtM(m, extrapolate, interpolate) {
    if (this.layout != "XYM" && this.layout != "XYZM" || this.flatCoordinates.length === 0) {
      return null;
    }
    extrapolate = extrapolate !== void 0 ? extrapolate : false;
    interpolate = interpolate !== void 0 ? interpolate : false;
    return lineStringsCoordinateAtM(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      m,
      extrapolate,
      interpolate
    );
  }
  /**
   * Return the coordinates of the multilinestring.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return inflateCoordinatesArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * Return the linestring at the specified index.
   * @param {number} index Index.
   * @return {LineString} LineString.
   * @api
   */
  getLineString(index) {
    if (index < 0 || this.ends_.length <= index) {
      return null;
    }
    return new LineString(
      this.flatCoordinates.slice(
        index === 0 ? 0 : this.ends_[index - 1],
        this.ends_[index]
      ),
      this.layout
    );
  }
  /**
   * Return the linestrings of this multilinestring.
   * @return {Array<LineString>} LineStrings.
   * @api
   */
  getLineStrings() {
    const flatCoordinates = this.flatCoordinates;
    const ends = this.ends_;
    const layout = this.layout;
    const lineStrings = [];
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const lineString = new LineString(
        flatCoordinates.slice(offset, end),
        layout
      );
      lineStrings.push(lineString);
      offset = end;
    }
    return lineStrings;
  }
  /**
   * Return the sum of all line string lengths
   * @return {number} Length (on projected plane).
   * @api
   */
  getLength() {
    const ends = this.ends_;
    let start = 0;
    let length = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      length += lineStringLength(
        this.flatCoordinates,
        start,
        ends[i],
        this.stride
      );
      start = ends[i];
    }
    return length;
  }
  /**
   * @return {Array<number>} Flat midpoints.
   */
  getFlatMidpoints() {
    const midpoints = [];
    const flatCoordinates = this.flatCoordinates;
    let offset = 0;
    const ends = this.ends_;
    const stride = this.stride;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      const midpoint = interpolatePoint(
        flatCoordinates,
        offset,
        end,
        stride,
        0.5
      );
      extend$1(midpoints, midpoint);
      offset = end;
    }
    return midpoints;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {MultiLineString} Simplified MultiLineString.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEnds = [];
    simplifiedFlatCoordinates.length = douglasPeuckerArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      squaredTolerance,
      simplifiedFlatCoordinates,
      0,
      simplifiedEnds
    );
    return new MultiLineString(simplifiedFlatCoordinates, "XY", simplifiedEnds);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "MultiLineString";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(extent) {
    return intersectsLineStringArray(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      extent
    );
  }
  /**
   * Set the coordinates of the multilinestring.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(coordinates, layout) {
    this.setLayout(layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const ends = deflateCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  }
}
class MultiPoint extends SimpleGeometry {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(coordinates, layout) {
    super();
    if (layout && !Array.isArray(coordinates[0])) {
      this.setFlatCoordinates(
        layout,
        /** @type {Array<number>} */
        coordinates
      );
    } else {
      this.setCoordinates(
        /** @type {Array<import("../coordinate.js").Coordinate>} */
        coordinates,
        layout
      );
    }
  }
  /**
   * Append the passed point to this multipoint.
   * @param {Point} point Point.
   * @api
   */
  appendPoint(point) {
    extend$1(this.flatCoordinates, point.getFlatCoordinates());
    this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPoint} Clone.
   * @api
   * @override
   */
  clone() {
    const multiPoint = new MultiPoint(
      this.flatCoordinates.slice(),
      this.layout
    );
    multiPoint.applyProperties(this);
    return multiPoint;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    const flatCoordinates = this.flatCoordinates;
    const stride = this.stride;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const squaredDistance$12 = squaredDistance(
        x,
        y,
        flatCoordinates[i],
        flatCoordinates[i + 1]
      );
      if (squaredDistance$12 < minSquaredDistance) {
        minSquaredDistance = squaredDistance$12;
        for (let j = 0; j < stride; ++j) {
          closestPoint[j] = flatCoordinates[i + j];
        }
        closestPoint.length = stride;
      }
    }
    return minSquaredDistance;
  }
  /**
   * Return the coordinates of the multipoint.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return inflateCoordinates(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the point at the specified index.
   * @param {number} index Index.
   * @return {Point} Point.
   * @api
   */
  getPoint(index) {
    const n = this.flatCoordinates.length / this.stride;
    if (index < 0 || n <= index) {
      return null;
    }
    return new Point(
      this.flatCoordinates.slice(
        index * this.stride,
        (index + 1) * this.stride
      ),
      this.layout
    );
  }
  /**
   * Return the points of this multipoint.
   * @return {Array<Point>} Points.
   * @api
   */
  getPoints() {
    const flatCoordinates = this.flatCoordinates;
    const layout = this.layout;
    const stride = this.stride;
    const points = [];
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const point = new Point(flatCoordinates.slice(i, i + stride), layout);
      points.push(point);
    }
    return points;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "MultiPoint";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(extent) {
    const flatCoordinates = this.flatCoordinates;
    const stride = this.stride;
    for (let i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      const x = flatCoordinates[i];
      const y = flatCoordinates[i + 1];
      if (containsXY(extent, x, y)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Set the coordinates of the multipoint.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(coordinates, layout) {
    this.setLayout(layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = deflateCoordinates(
      this.flatCoordinates,
      0,
      coordinates,
      this.stride
    );
    this.changed();
  }
}
class MultiPolygon extends SimpleGeometry {
  /**
   * @param {Array<Array<Array<import("../coordinate.js").Coordinate>>|Polygon>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` and `endss` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<Array<number>>} [endss] Array of ends for internal use with flat coordinates.
   */
  constructor(coordinates, layout, endss) {
    super();
    this.endss_ = [];
    this.flatInteriorPointsRevision_ = -1;
    this.flatInteriorPoints_ = null;
    this.maxDelta_ = -1;
    this.maxDeltaRevision_ = -1;
    this.orientedRevision_ = -1;
    this.orientedFlatCoordinates_ = null;
    if (!endss && !Array.isArray(coordinates[0])) {
      const polygons = (
        /** @type {Array<Polygon>} */
        coordinates
      );
      const flatCoordinates = [];
      const thisEndss = [];
      for (let i = 0, ii = polygons.length; i < ii; ++i) {
        const polygon = polygons[i];
        const offset = flatCoordinates.length;
        const ends = polygon.getEnds();
        for (let j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] += offset;
        }
        extend$1(flatCoordinates, polygon.getFlatCoordinates());
        thisEndss.push(ends);
      }
      layout = polygons.length === 0 ? this.getLayout() : polygons[0].getLayout();
      coordinates = flatCoordinates;
      endss = thisEndss;
    }
    if (layout !== void 0 && endss) {
      this.setFlatCoordinates(
        layout,
        /** @type {Array<number>} */
        coordinates
      );
      this.endss_ = endss;
    } else {
      this.setCoordinates(
        /** @type {Array<Array<Array<import("../coordinate.js").Coordinate>>>} */
        coordinates,
        layout
      );
    }
  }
  /**
   * Append the passed polygon to this multipolygon.
   * @param {Polygon} polygon Polygon.
   * @api
   */
  appendPolygon(polygon) {
    let ends;
    if (!this.flatCoordinates) {
      this.flatCoordinates = polygon.getFlatCoordinates().slice();
      ends = polygon.getEnds().slice();
      this.endss_.push();
    } else {
      const offset = this.flatCoordinates.length;
      extend$1(this.flatCoordinates, polygon.getFlatCoordinates());
      ends = polygon.getEnds().slice();
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] += offset;
      }
    }
    this.endss_.push(ends);
    this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPolygon} Clone.
   * @api
   * @override
   */
  clone() {
    const len = this.endss_.length;
    const newEndss = new Array(len);
    for (let i = 0; i < len; ++i) {
      newEndss[i] = this.endss_[i].slice();
    }
    const multiPolygon = new MultiPolygon(
      this.flatCoordinates.slice(),
      this.layout,
      newEndss
    );
    multiPolygon.applyProperties(this);
    return multiPolygon;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt(
        multiArrayMaxSquaredDelta(
          this.flatCoordinates,
          0,
          this.endss_,
          this.stride,
          0
        )
      );
      this.maxDeltaRevision_ = this.getRevision();
    }
    return assignClosestMultiArrayPoint(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      this.maxDelta_,
      true,
      x,
      y,
      closestPoint,
      minSquaredDistance
    );
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(x, y) {
    return linearRingssContainsXY(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      x,
      y
    );
  }
  /**
   * Return the area of the multipolygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return linearRingss(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for multi-polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<Array<import("../coordinate.js").Coordinate>>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates(right) {
    let flatCoordinates;
    if (right !== void 0) {
      flatCoordinates = this.getOrientedFlatCoordinates().slice();
      orientLinearRingsArray(
        flatCoordinates,
        0,
        this.endss_,
        this.stride,
        right
      );
    } else {
      flatCoordinates = this.flatCoordinates;
    }
    return inflateMultiCoordinatesArray(
      flatCoordinates,
      0,
      this.endss_,
      this.stride
    );
  }
  /**
   * @return {Array<Array<number>>} Endss.
   */
  getEndss() {
    return this.endss_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoints() {
    if (this.flatInteriorPointsRevision_ != this.getRevision()) {
      const flatCenters = linearRingss$1(
        this.flatCoordinates,
        0,
        this.endss_,
        this.stride
      );
      this.flatInteriorPoints_ = getInteriorPointsOfMultiArray(
        this.getOrientedFlatCoordinates(),
        0,
        this.endss_,
        this.stride,
        flatCenters
      );
      this.flatInteriorPointsRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.flatInteriorPoints_
    );
  }
  /**
   * Return the interior points as {@link module:ol/geom/MultiPoint~MultiPoint multipoint}.
   * @return {MultiPoint} Interior points as XYM coordinates, where M is
   * the length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoints() {
    return new MultiPoint(this.getFlatInteriorPoints().slice(), "XYM");
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const flatCoordinates = this.flatCoordinates;
      if (linearRingssAreOriented(flatCoordinates, 0, this.endss_, this.stride)) {
        this.orientedFlatCoordinates_ = flatCoordinates;
      } else {
        this.orientedFlatCoordinates_ = flatCoordinates.slice();
        this.orientedFlatCoordinates_.length = orientLinearRingsArray(
          this.orientedFlatCoordinates_,
          0,
          this.endss_,
          this.stride
        );
      }
      this.orientedRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.orientedFlatCoordinates_
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {MultiPolygon} Simplified MultiPolygon.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(squaredTolerance) {
    const simplifiedFlatCoordinates = [];
    const simplifiedEndss = [];
    simplifiedFlatCoordinates.length = quantizeMultiArray(
      this.flatCoordinates,
      0,
      this.endss_,
      this.stride,
      Math.sqrt(squaredTolerance),
      simplifiedFlatCoordinates,
      0,
      simplifiedEndss
    );
    return new MultiPolygon(simplifiedFlatCoordinates, "XY", simplifiedEndss);
  }
  /**
   * Return the polygon at the specified index.
   * @param {number} index Index.
   * @return {Polygon} Polygon.
   * @api
   */
  getPolygon(index) {
    if (index < 0 || this.endss_.length <= index) {
      return null;
    }
    let offset;
    if (index === 0) {
      offset = 0;
    } else {
      const prevEnds = this.endss_[index - 1];
      offset = prevEnds[prevEnds.length - 1];
    }
    const ends = this.endss_[index].slice();
    const end = ends[ends.length - 1];
    if (offset !== 0) {
      for (let i = 0, ii = ends.length; i < ii; ++i) {
        ends[i] -= offset;
      }
    }
    return new Polygon(
      this.flatCoordinates.slice(offset, end),
      this.layout,
      ends
    );
  }
  /**
   * Return the polygons of this multipolygon.
   * @return {Array<Polygon>} Polygons.
   * @api
   */
  getPolygons() {
    const layout = this.layout;
    const flatCoordinates = this.flatCoordinates;
    const endss = this.endss_;
    const polygons = [];
    let offset = 0;
    for (let i = 0, ii = endss.length; i < ii; ++i) {
      const ends = endss[i].slice();
      const end = ends[ends.length - 1];
      if (offset !== 0) {
        for (let j = 0, jj = ends.length; j < jj; ++j) {
          ends[j] -= offset;
        }
      }
      const polygon = new Polygon(
        flatCoordinates.slice(offset, end),
        layout,
        ends
      );
      polygons.push(polygon);
      offset = end;
    }
    return polygons;
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "MultiPolygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(extent) {
    return intersectsLinearRingMultiArray(
      this.getOrientedFlatCoordinates(),
      0,
      this.endss_,
      this.stride,
      extent
    );
  }
  /**
   * Set the coordinates of the multipolygon.
   * @param {!Array<Array<Array<import("../coordinate.js").Coordinate>>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(coordinates, layout) {
    this.setLayout(layout, coordinates, 3);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    const endss = deflateMultiCoordinatesArray(
      this.flatCoordinates,
      0,
      coordinates,
      this.stride,
      this.endss_
    );
    if (endss.length === 0) {
      this.flatCoordinates.length = 0;
    } else {
      const lastEnds = endss[endss.length - 1];
      this.flatCoordinates.length = lastEnds.length === 0 ? 0 : lastEnds[lastEnds.length - 1];
    }
    this.changed();
  }
}
function getCoordinate(coordinates, index) {
  const count = coordinates.length;
  if (index < 0) {
    return coordinates[index + count];
  }
  if (index >= count) {
    return coordinates[index - count];
  }
  return coordinates[index];
}
function interpolateCoordinate(coordinates, index) {
  const count = coordinates.length;
  let startIndex = Math.floor(index);
  const along = index - startIndex;
  if (startIndex >= count) {
    startIndex -= count;
  } else if (startIndex < 0) {
    startIndex += count;
  }
  let endIndex = startIndex + 1;
  if (endIndex >= count) {
    endIndex -= count;
  }
  const start = coordinates[startIndex];
  const x0 = start[0];
  const y0 = start[1];
  const end = coordinates[endIndex];
  const dx = end[0] - x0;
  const dy = end[1] - y0;
  return [x0 + dx * along, y0 + dy * along];
}
const sharedUpdateInfo = {
  index: -1,
  endIndex: NaN,
  closestTargetDistance: Infinity
};
function getTraceTargetUpdate(coordinate, traceState, map, snapTolerance) {
  const x = coordinate[0];
  const y = coordinate[1];
  let closestTargetDistance = Infinity;
  let newTargetIndex = -1;
  let newEndIndex = NaN;
  for (let targetIndex = 0; targetIndex < traceState.targets.length; ++targetIndex) {
    const target = traceState.targets[targetIndex];
    const coordinates = target.coordinates;
    let minSegmentDistance = Infinity;
    let endIndex;
    for (let coordinateIndex = 0; coordinateIndex < coordinates.length - 1; ++coordinateIndex) {
      const start = coordinates[coordinateIndex];
      const end = coordinates[coordinateIndex + 1];
      const rel = getPointSegmentRelationship(x, y, start, end);
      if (rel.squaredDistance < minSegmentDistance) {
        minSegmentDistance = rel.squaredDistance;
        endIndex = coordinateIndex + rel.along;
      }
    }
    if (minSegmentDistance < closestTargetDistance) {
      closestTargetDistance = minSegmentDistance;
      if (target.ring && traceState.targetIndex === targetIndex) {
        if (target.endIndex > target.startIndex) {
          if (endIndex < target.startIndex) {
            endIndex += coordinates.length;
          }
        } else if (target.endIndex < target.startIndex) {
          if (endIndex > target.startIndex) {
            endIndex -= coordinates.length;
          }
        }
      }
      newEndIndex = endIndex;
      newTargetIndex = targetIndex;
    }
  }
  const newTarget = traceState.targets[newTargetIndex];
  let considerBothDirections = newTarget.ring;
  if (traceState.targetIndex === newTargetIndex && considerBothDirections) {
    const newCoordinate = interpolateCoordinate(
      newTarget.coordinates,
      newEndIndex
    );
    const pixel = map.getPixelFromCoordinate(newCoordinate);
    const startPx = map.getPixelFromCoordinate(traceState.startCoord);
    if (distance(pixel, startPx) > snapTolerance) {
      considerBothDirections = false;
    }
  }
  if (considerBothDirections) {
    const coordinates = newTarget.coordinates;
    const count = coordinates.length;
    const startIndex = newTarget.startIndex;
    const endIndex = newEndIndex;
    if (startIndex < endIndex) {
      const forwardDistance = getCumulativeSquaredDistance(
        coordinates,
        startIndex,
        endIndex
      );
      const reverseDistance = getCumulativeSquaredDistance(
        coordinates,
        startIndex,
        endIndex - count
      );
      if (reverseDistance < forwardDistance) {
        newEndIndex -= count;
      }
    } else {
      const reverseDistance = getCumulativeSquaredDistance(
        coordinates,
        startIndex,
        endIndex
      );
      const forwardDistance = getCumulativeSquaredDistance(
        coordinates,
        startIndex,
        endIndex + count
      );
      if (forwardDistance < reverseDistance) {
        newEndIndex += count;
      }
    }
  }
  sharedUpdateInfo.index = newTargetIndex;
  sharedUpdateInfo.endIndex = newEndIndex;
  sharedUpdateInfo.closestTargetDistance = closestTargetDistance;
  return sharedUpdateInfo;
}
function getTraceTargets(coordinate, features) {
  const targets = [];
  for (let i = 0; i < features.length; ++i) {
    const feature = features[i];
    const geometry = feature.getGeometry();
    appendGeometryTraceTargets(coordinate, geometry, targets);
  }
  return targets;
}
function appendGeometryTraceTargets(coordinate, geometry, targets) {
  if (geometry instanceof LineString) {
    appendTraceTarget(coordinate, geometry.getCoordinates(), false, targets);
    return;
  }
  if (geometry instanceof MultiLineString) {
    const coordinates = geometry.getCoordinates();
    for (let i = 0, ii = coordinates.length; i < ii; ++i) {
      appendTraceTarget(coordinate, coordinates[i], false, targets);
    }
    return;
  }
  if (geometry instanceof Polygon) {
    const coordinates = geometry.getCoordinates();
    for (let i = 0, ii = coordinates.length; i < ii; ++i) {
      appendTraceTarget(coordinate, coordinates[i], true, targets);
    }
    return;
  }
  if (geometry instanceof MultiPolygon) {
    const polys = geometry.getCoordinates();
    for (let i = 0, ii = polys.length; i < ii; ++i) {
      const coordinates = polys[i];
      for (let j = 0, jj = coordinates.length; j < jj; ++j) {
        appendTraceTarget(coordinate, coordinates[j], true, targets);
      }
    }
    return;
  }
  if (geometry instanceof GeometryCollection) {
    const geometries = geometry.getGeometries();
    for (let i = 0; i < geometries.length; ++i) {
      appendGeometryTraceTargets(coordinate, geometries[i], targets);
    }
    return;
  }
}
function appendTraceTarget(coordinate, coordinates, ring, targets) {
  const x = coordinate[0];
  const y = coordinate[1];
  for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    const rel = getPointSegmentRelationship(x, y, start, end);
    if (rel.squaredDistance === 0) {
      const index = i + rel.along;
      targets.push({
        coordinates,
        ring,
        startIndex: index,
        endIndex: index
      });
      return;
    }
  }
}
function getSquaredDistance(a, b) {
  return squaredDistance(a[0], a[1], b[0], b[1]);
}
function getCumulativeSquaredDistance(coordinates, startIndex, endIndex) {
  let lowIndex, highIndex;
  if (startIndex < endIndex) {
    lowIndex = startIndex;
    highIndex = endIndex;
  } else {
    lowIndex = endIndex;
    highIndex = startIndex;
  }
  const lowWholeIndex = Math.ceil(lowIndex);
  const highWholeIndex = Math.floor(highIndex);
  if (lowWholeIndex > highWholeIndex) {
    const start = interpolateCoordinate(coordinates, lowIndex);
    const end = interpolateCoordinate(coordinates, highIndex);
    return getSquaredDistance(start, end);
  }
  let sd = 0;
  if (lowIndex < lowWholeIndex) {
    const start = interpolateCoordinate(coordinates, lowIndex);
    const end = getCoordinate(coordinates, lowWholeIndex);
    sd += getSquaredDistance(start, end);
  }
  if (highWholeIndex < highIndex) {
    const start = getCoordinate(coordinates, highWholeIndex);
    const end = interpolateCoordinate(coordinates, highIndex);
    sd += getSquaredDistance(start, end);
  }
  for (let i = lowWholeIndex; i < highWholeIndex - 1; ++i) {
    const start = getCoordinate(coordinates, i);
    const end = getCoordinate(coordinates, i + 1);
    sd += getSquaredDistance(start, end);
  }
  return sd;
}
const sharedRel = { along: 0, squaredDistance: 0 };
function getPointSegmentRelationship(x, y, start, end) {
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  let along = 0;
  let px = x1;
  let py = y1;
  if (dx !== 0 || dy !== 0) {
    along = clamp(((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy), 0, 1);
    px += dx * along;
    py += dy * along;
  }
  sharedRel.along = along;
  sharedRel.squaredDistance = toFixed(squaredDistance(x, y, px, py), 10);
  return sharedRel;
}
const DrawEventType = {
  /**
   * Triggered upon feature draw start
   * @event DrawEvent#drawstart
   * @api
   */
  DRAWSTART: "drawstart",
  /**
   * Triggered upon feature draw end
   * @event DrawEvent#drawend
   * @api
   */
  DRAWEND: "drawend",
  /**
   * Triggered upon feature draw abortion
   * @event DrawEvent#drawabort
   * @api
   */
  DRAWABORT: "drawabort"
};
class DrawEvent extends BaseEvent {
  /**
   * @param {DrawEventType} type Type.
   * @param {Feature} feature The feature drawn.
   */
  constructor(type, feature) {
    super(type);
    this.feature = feature;
  }
}
class Draw extends PointerInteraction {
  /**
   * @param {Options} options Options.
   */
  constructor(options) {
    const pointerOptions = (
      /** @type {import("./Pointer.js").Options} */
      options
    );
    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = FALSE;
    }
    super(pointerOptions);
    this.on;
    this.once;
    this.un;
    this.options_ = options;
    this.shouldHandle_ = false;
    this.downPx_ = null;
    this.downTimeout_;
    this.lastDragTime_;
    this.pointerType_;
    this.freehand_ = false;
    this.source_ = options.source ? options.source : null;
    this.features_ = options.features ? options.features : null;
    this.snapTolerance_ = options.snapTolerance ? options.snapTolerance : 12;
    this.type_ = /** @type {import("../geom/Geometry.js").Type} */
    options.type;
    this.mode_ = getMode(this.type_);
    this.stopClick_ = !!options.stopClick;
    this.ignoreNextUpEvent_ = false;
    this.minPoints_ = options.minPoints ? options.minPoints : this.mode_ === "Polygon" ? 3 : 2;
    this.maxPoints_ = this.mode_ === "Circle" ? 2 : options.maxPoints ? options.maxPoints : Infinity;
    this.finishCondition_ = options.finishCondition ? options.finishCondition : TRUE;
    this.geometryLayout_ = options.geometryLayout ? options.geometryLayout : "XY";
    let geometryFunction = options.geometryFunction;
    if (!geometryFunction) {
      const mode = this.mode_;
      if (mode === "Circle") {
        geometryFunction = (coordinates, geometry, projection) => {
          const circle = geometry ? (
            /** @type {Circle} */
            geometry
          ) : new Circle([NaN, NaN]);
          const center = fromUserCoordinate(coordinates[0]);
          const squaredLength = squaredDistance$1(
            center,
            fromUserCoordinate(coordinates[coordinates.length - 1])
          );
          circle.setCenterAndRadius(
            center,
            Math.sqrt(squaredLength),
            this.geometryLayout_
          );
          return circle;
        };
      } else {
        let Constructor;
        if (mode === "Point") {
          Constructor = Point;
        } else if (mode === "LineString") {
          Constructor = LineString;
        } else if (mode === "Polygon") {
          Constructor = Polygon;
        }
        geometryFunction = (coordinates, geometry, projection) => {
          if (geometry) {
            if (mode === "Polygon") {
              if (coordinates[0].length) {
                geometry.setCoordinates(
                  [coordinates[0].concat([coordinates[0][0]])],
                  this.geometryLayout_
                );
              } else {
                geometry.setCoordinates([], this.geometryLayout_);
              }
            } else {
              geometry.setCoordinates(coordinates, this.geometryLayout_);
            }
          } else {
            geometry = new Constructor(coordinates, this.geometryLayout_);
          }
          return geometry;
        };
      }
    }
    this.geometryFunction_ = geometryFunction;
    this.dragVertexDelay_ = options.dragVertexDelay !== void 0 ? options.dragVertexDelay : 500;
    this.finishCoordinate_ = null;
    this.sketchFeature_ = null;
    this.sketchPoint_ = null;
    this.sketchCoords_ = null;
    this.sketchLine_ = null;
    this.sketchLineCoords_ = null;
    this.squaredClickTolerance_ = options.clickTolerance ? options.clickTolerance * options.clickTolerance : 36;
    this.overlay_ = new VectorLayer({
      source: new VectorSource({
        useSpatialIndex: false,
        wrapX: options.wrapX ? options.wrapX : false
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileInteracting: true
    });
    this.geometryName_ = options.geometryName;
    this.condition_ = options.condition ? options.condition : noModifierKeys;
    this.freehandCondition_;
    if (options.freehand) {
      this.freehandCondition_ = always;
    } else {
      this.freehandCondition_ = options.freehandCondition ? options.freehandCondition : shiftKeyOnly;
    }
    this.traceCondition_;
    this.setTrace(options.trace || false);
    this.traceState_ = { active: false };
    this.traceSource_ = options.traceSource || options.source || null;
    this.addChangeListener(InteractionProperty.ACTIVE, this.updateState_);
  }
  /**
   * Toggle tracing mode or set a tracing condition.
   *
   * @param {boolean|import("../events/condition.js").Condition} trace A boolean to toggle tracing mode or an event
   *     condition that will be checked when a feature is clicked to determine if tracing should be active.
   */
  setTrace(trace) {
    let condition;
    if (!trace) {
      condition = never;
    } else if (trace === true) {
      condition = always;
    } else {
      condition = trace;
    }
    this.traceCondition_ = condition;
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default} map Map.
   * @override
   */
  setMap(map) {
    super.setMap(map);
    this.updateState_();
  }
  /**
   * Set whether the drawing is done in freehand mode.
   *
   * @param {boolean} freehand Freehand drawing.
   * @api
   */
  setFreehand(freehand) {
    this.freehand_ = freehand;
    if (this.freehand_) {
      this.freehandCondition_ = always;
    } else {
      this.freehandCondition_ = this.options_ && this.options_.freehandCondition ? this.options_.freehandCondition : shiftKeyOnly;
    }
  }
  /**
   * Get the overlay layer that this interaction renders sketch features to.
   * @return {VectorLayer} Overlay layer.
   * @api
   */
  getOverlay() {
    return this.overlay_;
  }
  /**
   * Get if this interaction is in freehand mode.
   * @return {boolean} Freehand drawing.
   * @api
   */
  getFreehand() {
    return this.freehand_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may actually draw or finish the drawing.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   * @override
   */
  handleEvent(event) {
    if (event.originalEvent.type === EventType.CONTEXTMENU) {
      event.originalEvent.preventDefault();
    }
    this.freehand_ = this.mode_ !== "Point" && this.freehandCondition_(event);
    let move = event.type === MapBrowserEventType.POINTERMOVE;
    let pass = true;
    if (!this.freehand_ && this.lastDragTime_ && event.type === MapBrowserEventType.POINTERDRAG) {
      const now = Date.now();
      if (now - this.lastDragTime_ >= this.dragVertexDelay_) {
        this.downPx_ = event.pixel;
        this.shouldHandle_ = !this.freehand_;
        move = true;
      } else {
        this.lastDragTime_ = void 0;
      }
      if (this.shouldHandle_ && this.downTimeout_ !== void 0) {
        clearTimeout(this.downTimeout_);
        this.downTimeout_ = void 0;
      }
    }
    if (this.freehand_ && event.type === MapBrowserEventType.POINTERDRAG && this.sketchFeature_ !== null) {
      this.addToDrawing_(event.coordinate);
      pass = false;
    } else if (this.freehand_ && event.type === MapBrowserEventType.POINTERDOWN) {
      pass = false;
    } else if (move && this.getPointerCount() < 2) {
      pass = event.type === MapBrowserEventType.POINTERMOVE;
      if (pass && this.freehand_) {
        this.handlePointerMove_(event);
        if (this.shouldHandle_) {
          event.originalEvent.preventDefault();
        }
      } else if (event.originalEvent.pointerType === "mouse" || event.type === MapBrowserEventType.POINTERDRAG && this.downTimeout_ === void 0) {
        this.handlePointerMove_(event);
      }
    } else if (event.type === MapBrowserEventType.DBLCLICK) {
      pass = false;
    }
    return super.handleEvent(event) && pass;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(event) {
    this.shouldHandle_ = !this.freehand_;
    if (this.freehand_) {
      this.downPx_ = event.pixel;
      if (!this.finishCoordinate_) {
        this.startDrawing_(event.coordinate);
      }
      return true;
    }
    if (!this.condition_(event)) {
      this.lastDragTime_ = void 0;
      return false;
    }
    this.lastDragTime_ = Date.now();
    this.downTimeout_ = setTimeout(() => {
      this.handlePointerMove_(
        new MapBrowserEvent(
          MapBrowserEventType.POINTERMOVE,
          event.map,
          event.originalEvent,
          false,
          event.frameState
        )
      );
    }, this.dragVertexDelay_);
    this.downPx_ = event.pixel;
    return true;
  }
  /**
   * @private
   */
  deactivateTrace_() {
    this.traceState_ = { active: false };
  }
  /**
   * Activate or deactivate trace state based on a browser event.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @private
   */
  toggleTraceState_(event) {
    if (!this.traceSource_ || !this.traceCondition_(event)) {
      return;
    }
    if (this.traceState_.active) {
      this.deactivateTrace_();
      return;
    }
    const map = this.getMap();
    const lowerLeft = map.getCoordinateFromPixel([
      event.pixel[0] - this.snapTolerance_,
      event.pixel[1] + this.snapTolerance_
    ]);
    const upperRight = map.getCoordinateFromPixel([
      event.pixel[0] + this.snapTolerance_,
      event.pixel[1] - this.snapTolerance_
    ]);
    const extent = boundingExtent([lowerLeft, upperRight]);
    const features = this.traceSource_.getFeaturesInExtent(extent);
    if (features.length === 0) {
      return;
    }
    const targets = getTraceTargets(event.coordinate, features);
    if (targets.length) {
      this.traceState_ = {
        active: true,
        startCoord: event.coordinate.slice(),
        targets,
        targetIndex: -1
      };
    }
  }
  /**
   * @param {TraceTarget} target The trace target.
   * @param {number} endIndex The new end index of the trace.
   * @private
   */
  addOrRemoveTracedCoordinates_(target, endIndex) {
    const previouslyForward = target.startIndex <= target.endIndex;
    const currentlyForward = target.startIndex <= endIndex;
    if (previouslyForward === currentlyForward) {
      if (previouslyForward && endIndex > target.endIndex || !previouslyForward && endIndex < target.endIndex) {
        this.addTracedCoordinates_(target, target.endIndex, endIndex);
      } else if (previouslyForward && endIndex < target.endIndex || !previouslyForward && endIndex > target.endIndex) {
        this.removeTracedCoordinates_(endIndex, target.endIndex);
      }
    } else {
      this.removeTracedCoordinates_(target.startIndex, target.endIndex);
      this.addTracedCoordinates_(target, target.startIndex, endIndex);
    }
  }
  /**
   * @param {number} fromIndex The start index.
   * @param {number} toIndex The end index.
   * @private
   */
  removeTracedCoordinates_(fromIndex, toIndex) {
    if (fromIndex === toIndex) {
      return;
    }
    let remove = 0;
    if (fromIndex < toIndex) {
      const start = Math.ceil(fromIndex);
      let end = Math.floor(toIndex);
      if (end === toIndex) {
        end -= 1;
      }
      remove = end - start + 1;
    } else {
      const start = Math.floor(fromIndex);
      let end = Math.ceil(toIndex);
      if (end === toIndex) {
        end += 1;
      }
      remove = start - end + 1;
    }
    if (remove > 0) {
      this.removeLastPoints_(remove);
    }
  }
  /**
   * @param {TraceTarget} target The trace target.
   * @param {number} fromIndex The start index.
   * @param {number} toIndex The end index.
   * @private
   */
  addTracedCoordinates_(target, fromIndex, toIndex) {
    if (fromIndex === toIndex) {
      return;
    }
    const coordinates = [];
    if (fromIndex < toIndex) {
      const start = Math.ceil(fromIndex);
      let end = Math.floor(toIndex);
      if (end === toIndex) {
        end -= 1;
      }
      for (let i = start; i <= end; ++i) {
        coordinates.push(getCoordinate(target.coordinates, i));
      }
    } else {
      const start = Math.floor(fromIndex);
      let end = Math.ceil(toIndex);
      if (end === toIndex) {
        end += 1;
      }
      for (let i = start; i >= end; --i) {
        coordinates.push(getCoordinate(target.coordinates, i));
      }
    }
    if (coordinates.length) {
      this.appendCoordinates(coordinates);
    }
  }
  /**
   * Update the trace.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @private
   */
  updateTrace_(event) {
    const traceState = this.traceState_;
    if (!traceState.active) {
      return;
    }
    if (traceState.targetIndex === -1) {
      const startPx = event.map.getPixelFromCoordinate(traceState.startCoord);
      if (distance(startPx, event.pixel) < this.snapTolerance_) {
        return;
      }
    }
    const updatedTraceTarget = getTraceTargetUpdate(
      event.coordinate,
      traceState,
      this.getMap(),
      this.snapTolerance_
    );
    if (traceState.targetIndex !== updatedTraceTarget.index) {
      if (traceState.targetIndex !== -1) {
        const oldTarget = traceState.targets[traceState.targetIndex];
        this.removeTracedCoordinates_(oldTarget.startIndex, oldTarget.endIndex);
      }
      const newTarget = traceState.targets[updatedTraceTarget.index];
      this.addTracedCoordinates_(
        newTarget,
        newTarget.startIndex,
        updatedTraceTarget.endIndex
      );
    } else {
      const target2 = traceState.targets[traceState.targetIndex];
      this.addOrRemoveTracedCoordinates_(target2, updatedTraceTarget.endIndex);
    }
    traceState.targetIndex = updatedTraceTarget.index;
    const target = traceState.targets[traceState.targetIndex];
    target.endIndex = updatedTraceTarget.endIndex;
    const coordinate = interpolateCoordinate(
      target.coordinates,
      target.endIndex
    );
    const pixel = this.getMap().getPixelFromCoordinate(coordinate);
    event.coordinate = coordinate;
    event.pixel = [Math.round(pixel[0]), Math.round(pixel[1])];
  }
  /**
   * Handle drag events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Event.
   * @override
   */
  handleDragEvent(event) {
    this.ignoreNextUpEvent_ = true;
    super.handleDragEvent(event);
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(event) {
    let pass = true;
    if (this.getPointerCount() === 0) {
      if (this.downTimeout_) {
        clearTimeout(this.downTimeout_);
        this.downTimeout_ = void 0;
      }
      this.handlePointerMove_(event);
      const tracing = this.traceState_.active;
      if (!this.ignoreNextUpEvent_) {
        this.toggleTraceState_(event);
      }
      if (this.shouldHandle_) {
        const startingToDraw = !this.finishCoordinate_;
        if (startingToDraw) {
          this.startDrawing_(event.coordinate);
        }
        if (!startingToDraw && this.freehand_) {
          this.finishDrawing();
        } else if (!this.freehand_ && (!startingToDraw || this.mode_ === "Point")) {
          if (this.atFinish_(event.pixel, tracing)) {
            if (this.finishCondition_(event)) {
              this.finishDrawing();
            }
          } else {
            this.addToDrawing_(event.coordinate);
          }
        }
        pass = false;
      } else if (this.freehand_) {
        this.abortDrawing();
      }
    }
    this.ignoreNextUpEvent_ = false;
    if (!pass && this.stopClick_) {
      event.preventDefault();
    }
    return pass;
  }
  /**
   * Handle move events.
   * @param {import("../MapBrowserEvent.js").default<PointerEvent>} event A move event.
   * @private
   */
  handlePointerMove_(event) {
    this.pointerType_ = event.originalEvent.pointerType;
    if (this.downPx_ && (!this.freehand_ && this.shouldHandle_ || this.freehand_ && !this.shouldHandle_)) {
      const downPx = this.downPx_;
      const clickPx = event.pixel;
      const dx = downPx[0] - clickPx[0];
      const dy = downPx[1] - clickPx[1];
      const squaredDistance2 = dx * dx + dy * dy;
      this.shouldHandle_ = this.freehand_ ? squaredDistance2 > this.squaredClickTolerance_ : squaredDistance2 <= this.squaredClickTolerance_;
      if (!this.shouldHandle_) {
        return;
      }
    }
    if (!this.finishCoordinate_) {
      this.createOrUpdateSketchPoint_(event.coordinate.slice());
      return;
    }
    this.updateTrace_(event);
    this.modifyDrawing_(event.coordinate);
  }
  /**
   * Determine if an event is within the snapping tolerance of the start coord.
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @param {boolean} [tracing] Drawing in trace mode (only stop if at the starting point).
   * @return {boolean} The event is within the snapping tolerance of the start.
   * @private
   */
  atFinish_(pixel, tracing) {
    let at = false;
    if (this.sketchFeature_) {
      let potentiallyDone = false;
      let potentiallyFinishCoordinates = [this.finishCoordinate_];
      const mode = this.mode_;
      if (mode === "Point") {
        at = true;
      } else if (mode === "Circle") {
        at = this.sketchCoords_.length === 2;
      } else if (mode === "LineString") {
        potentiallyDone = !tracing && this.sketchCoords_.length > this.minPoints_;
      } else if (mode === "Polygon") {
        const sketchCoords = (
          /** @type {PolyCoordType} */
          this.sketchCoords_
        );
        potentiallyDone = sketchCoords[0].length > this.minPoints_;
        potentiallyFinishCoordinates = [
          sketchCoords[0][0],
          sketchCoords[0][sketchCoords[0].length - 2]
        ];
        if (tracing) {
          potentiallyFinishCoordinates = [sketchCoords[0][0]];
        } else {
          potentiallyFinishCoordinates = [
            sketchCoords[0][0],
            sketchCoords[0][sketchCoords[0].length - 2]
          ];
        }
      }
      if (potentiallyDone) {
        const map = this.getMap();
        for (let i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
          const finishCoordinate = potentiallyFinishCoordinates[i];
          const finishPixel = map.getPixelFromCoordinate(finishCoordinate);
          const dx = pixel[0] - finishPixel[0];
          const dy = pixel[1] - finishPixel[1];
          const snapTolerance = this.freehand_ ? 1 : this.snapTolerance_;
          at = Math.sqrt(dx * dx + dy * dy) <= snapTolerance;
          if (at) {
            this.finishCoordinate_ = finishCoordinate;
            break;
          }
        }
      }
    }
    return at;
  }
  /**
   * @param {import("../coordinate").Coordinate} coordinates Coordinate.
   * @private
   */
  createOrUpdateSketchPoint_(coordinates) {
    if (!this.sketchPoint_) {
      this.sketchPoint_ = new Feature(new Point(coordinates));
      this.updateSketchFeatures_();
    } else {
      const sketchPointGeom = this.sketchPoint_.getGeometry();
      sketchPointGeom.setCoordinates(coordinates);
    }
  }
  /**
   * @param {import("../geom/Polygon.js").default} geometry Polygon geometry.
   * @private
   */
  createOrUpdateCustomSketchLine_(geometry) {
    if (!this.sketchLine_) {
      this.sketchLine_ = new Feature();
    }
    const ring = geometry.getLinearRing(0);
    let sketchLineGeom = this.sketchLine_.getGeometry();
    if (!sketchLineGeom) {
      sketchLineGeom = new LineString(
        ring.getFlatCoordinates(),
        ring.getLayout()
      );
      this.sketchLine_.setGeometry(sketchLineGeom);
    } else {
      sketchLineGeom.setFlatCoordinates(
        ring.getLayout(),
        ring.getFlatCoordinates()
      );
      sketchLineGeom.changed();
    }
  }
  /**
   * Start the drawing.
   * @param {import("../coordinate.js").Coordinate} start Start coordinate.
   * @private
   */
  startDrawing_(start) {
    const projection = this.getMap().getView().getProjection();
    const stride = getStrideForLayout(this.geometryLayout_);
    while (start.length < stride) {
      start.push(0);
    }
    this.finishCoordinate_ = start;
    if (this.mode_ === "Point") {
      this.sketchCoords_ = start.slice();
    } else if (this.mode_ === "Polygon") {
      this.sketchCoords_ = [[start.slice(), start.slice()]];
      this.sketchLineCoords_ = this.sketchCoords_[0];
    } else {
      this.sketchCoords_ = [start.slice(), start.slice()];
    }
    if (this.sketchLineCoords_) {
      this.sketchLine_ = new Feature(new LineString(this.sketchLineCoords_));
    }
    const geometry = this.geometryFunction_(
      this.sketchCoords_,
      void 0,
      projection
    );
    this.sketchFeature_ = new Feature();
    if (this.geometryName_) {
      this.sketchFeature_.setGeometryName(this.geometryName_);
    }
    this.sketchFeature_.setGeometry(geometry);
    this.updateSketchFeatures_();
    this.dispatchEvent(
      new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_)
    );
  }
  /**
   * Modify the drawing.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @private
   */
  modifyDrawing_(coordinate) {
    const map = this.getMap();
    const geometry = this.sketchFeature_.getGeometry();
    const projection = map.getView().getProjection();
    const stride = getStrideForLayout(this.geometryLayout_);
    let coordinates, last;
    while (coordinate.length < stride) {
      coordinate.push(0);
    }
    if (this.mode_ === "Point") {
      last = this.sketchCoords_;
    } else if (this.mode_ === "Polygon") {
      coordinates = /** @type {PolyCoordType} */
      this.sketchCoords_[0];
      last = coordinates[coordinates.length - 1];
      if (this.atFinish_(map.getPixelFromCoordinate(coordinate))) {
        coordinate = this.finishCoordinate_.slice();
      }
    } else {
      coordinates = this.sketchCoords_;
      last = coordinates[coordinates.length - 1];
    }
    last[0] = coordinate[0];
    last[1] = coordinate[1];
    this.geometryFunction_(
      /** @type {!LineCoordType} */
      this.sketchCoords_,
      geometry,
      projection
    );
    if (this.sketchPoint_) {
      const sketchPointGeom = this.sketchPoint_.getGeometry();
      sketchPointGeom.setCoordinates(coordinate);
    }
    if (geometry.getType() === "Polygon" && this.mode_ !== "Polygon") {
      this.createOrUpdateCustomSketchLine_(
        /** @type {Polygon} */
        geometry
      );
    } else if (this.sketchLineCoords_) {
      const sketchLineGeom = this.sketchLine_.getGeometry();
      sketchLineGeom.setCoordinates(this.sketchLineCoords_);
    }
    this.updateSketchFeatures_();
  }
  /**
   * Add a new coordinate to the drawing.
   * @param {!PointCoordType} coordinate Coordinate
   * @return {Feature<import("../geom/SimpleGeometry.js").default>} The sketch feature.
   * @private
   */
  addToDrawing_(coordinate) {
    const geometry = this.sketchFeature_.getGeometry();
    const projection = this.getMap().getView().getProjection();
    let done;
    let coordinates;
    const mode = this.mode_;
    if (mode === "LineString" || mode === "Circle") {
      this.finishCoordinate_ = coordinate.slice();
      coordinates = /** @type {LineCoordType} */
      this.sketchCoords_;
      if (coordinates.length >= this.maxPoints_) {
        if (this.freehand_) {
          coordinates.pop();
        } else {
          done = true;
        }
      }
      coordinates.push(coordinate.slice());
      this.geometryFunction_(coordinates, geometry, projection);
    } else if (mode === "Polygon") {
      coordinates = /** @type {PolyCoordType} */
      this.sketchCoords_[0];
      if (coordinates.length >= this.maxPoints_) {
        if (this.freehand_) {
          coordinates.pop();
        } else {
          done = true;
        }
      }
      coordinates.push(coordinate.slice());
      if (done) {
        this.finishCoordinate_ = coordinates[0];
      }
      this.geometryFunction_(this.sketchCoords_, geometry, projection);
    }
    this.createOrUpdateSketchPoint_(coordinate.slice());
    this.updateSketchFeatures_();
    if (done) {
      return this.finishDrawing();
    }
    return this.sketchFeature_;
  }
  /**
   * @param {number} n The number of points to remove.
   */
  removeLastPoints_(n) {
    if (!this.sketchFeature_) {
      return;
    }
    const geometry = this.sketchFeature_.getGeometry();
    const projection = this.getMap().getView().getProjection();
    const mode = this.mode_;
    for (let i = 0; i < n; ++i) {
      let coordinates;
      if (mode === "LineString" || mode === "Circle") {
        coordinates = /** @type {LineCoordType} */
        this.sketchCoords_;
        coordinates.splice(-2, 1);
        if (coordinates.length >= 2) {
          this.finishCoordinate_ = coordinates[coordinates.length - 2].slice();
          const finishCoordinate = this.finishCoordinate_.slice();
          coordinates[coordinates.length - 1] = finishCoordinate;
          this.createOrUpdateSketchPoint_(finishCoordinate);
        }
        this.geometryFunction_(coordinates, geometry, projection);
        if (geometry.getType() === "Polygon" && this.sketchLine_) {
          this.createOrUpdateCustomSketchLine_(
            /** @type {Polygon} */
            geometry
          );
        }
      } else if (mode === "Polygon") {
        coordinates = /** @type {PolyCoordType} */
        this.sketchCoords_[0];
        coordinates.splice(-2, 1);
        const sketchLineGeom = this.sketchLine_.getGeometry();
        if (coordinates.length >= 2) {
          const finishCoordinate = coordinates[coordinates.length - 2].slice();
          coordinates[coordinates.length - 1] = finishCoordinate;
          this.createOrUpdateSketchPoint_(finishCoordinate);
        }
        sketchLineGeom.setCoordinates(coordinates);
        this.geometryFunction_(this.sketchCoords_, geometry, projection);
      }
      if (coordinates.length === 1) {
        this.abortDrawing();
        break;
      }
    }
    this.updateSketchFeatures_();
  }
  /**
   * Remove last point of the feature currently being drawn. Does not do anything when
   * drawing POINT or MULTI_POINT geometries.
   * @api
   */
  removeLastPoint() {
    this.removeLastPoints_(1);
  }
  /**
   * Stop drawing and add the sketch feature to the target layer.
   * The {@link module:ol/interaction/Draw~DrawEventType.DRAWEND} event is
   * dispatched before inserting the feature.
   * @return {Feature<import("../geom/SimpleGeometry.js").default>|null} The drawn feature.
   * @api
   */
  finishDrawing() {
    const sketchFeature = this.abortDrawing_();
    if (!sketchFeature) {
      return null;
    }
    let coordinates = this.sketchCoords_;
    const geometry = sketchFeature.getGeometry();
    const projection = this.getMap().getView().getProjection();
    if (this.mode_ === "LineString") {
      coordinates.pop();
      this.geometryFunction_(coordinates, geometry, projection);
    } else if (this.mode_ === "Polygon") {
      coordinates[0].pop();
      this.geometryFunction_(coordinates, geometry, projection);
      coordinates = geometry.getCoordinates();
    }
    if (this.type_ === "MultiPoint") {
      sketchFeature.setGeometry(
        new MultiPoint([
          /** @type {PointCoordType} */
          coordinates
        ])
      );
    } else if (this.type_ === "MultiLineString") {
      sketchFeature.setGeometry(
        new MultiLineString([
          /** @type {LineCoordType} */
          coordinates
        ])
      );
    } else if (this.type_ === "MultiPolygon") {
      sketchFeature.setGeometry(
        new MultiPolygon([
          /** @type {PolyCoordType} */
          coordinates
        ])
      );
    }
    this.dispatchEvent(new DrawEvent(DrawEventType.DRAWEND, sketchFeature));
    if (this.features_) {
      this.features_.push(sketchFeature);
    }
    if (this.source_) {
      this.source_.addFeature(sketchFeature);
    }
    return sketchFeature;
  }
  /**
   * Stop drawing without adding the sketch feature to the target layer.
   * @return {Feature<import("../geom/SimpleGeometry.js").default>|null} The sketch feature (or null if none).
   * @private
   */
  abortDrawing_() {
    this.finishCoordinate_ = null;
    const sketchFeature = this.sketchFeature_;
    this.sketchFeature_ = null;
    this.sketchPoint_ = null;
    this.sketchLine_ = null;
    this.overlay_.getSource().clear(true);
    this.deactivateTrace_();
    return sketchFeature;
  }
  /**
   * Stop drawing without adding the sketch feature to the target layer.
   * @api
   */
  abortDrawing() {
    const sketchFeature = this.abortDrawing_();
    if (sketchFeature) {
      this.dispatchEvent(new DrawEvent(DrawEventType.DRAWABORT, sketchFeature));
    }
  }
  /**
   * Append coordinates to the end of the geometry that is currently being drawn.
   * This can be used when drawing LineStrings or Polygons. Coordinates will
   * either be appended to the current LineString or the outer ring of the current
   * Polygon. If no geometry is being drawn, a new one will be created.
   * @param {!LineCoordType} coordinates Linear coordinates to be appended to
   * the coordinate array.
   * @api
   */
  appendCoordinates(coordinates) {
    const mode = this.mode_;
    const newDrawing = !this.sketchFeature_;
    if (newDrawing) {
      this.startDrawing_(coordinates[0]);
    }
    let sketchCoords;
    if (mode === "LineString" || mode === "Circle") {
      sketchCoords = /** @type {LineCoordType} */
      this.sketchCoords_;
    } else if (mode === "Polygon") {
      sketchCoords = this.sketchCoords_ && this.sketchCoords_.length ? (
        /** @type {PolyCoordType} */
        this.sketchCoords_[0]
      ) : [];
    } else {
      return;
    }
    if (newDrawing) {
      sketchCoords.shift();
    }
    sketchCoords.pop();
    for (let i = 0; i < coordinates.length; i++) {
      this.addToDrawing_(coordinates[i]);
    }
    const ending = coordinates[coordinates.length - 1];
    this.sketchFeature_ = this.addToDrawing_(ending);
    this.modifyDrawing_(ending);
  }
  /**
   * Initiate draw mode by starting from an existing geometry which will
   * receive new additional points. This only works on features with
   * `LineString` geometries, where the interaction will extend lines by adding
   * points to the end of the coordinates array.
   * This will change the original feature, instead of drawing a copy.
   *
   * The function will dispatch a `drawstart` event.
   *
   * @param {!Feature<LineString>} feature Feature to be extended.
   * @api
   */
  extend(feature) {
    const geometry = feature.getGeometry();
    const lineString = geometry;
    this.sketchFeature_ = feature;
    this.sketchCoords_ = lineString.getCoordinates();
    const last = this.sketchCoords_[this.sketchCoords_.length - 1];
    this.finishCoordinate_ = last.slice();
    this.sketchCoords_.push(last.slice());
    this.sketchPoint_ = new Feature(new Point(last));
    this.updateSketchFeatures_();
    this.dispatchEvent(
      new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_)
    );
  }
  /**
   * Redraw the sketch features.
   * @private
   */
  updateSketchFeatures_() {
    const sketchFeatures = [];
    if (this.sketchFeature_) {
      sketchFeatures.push(this.sketchFeature_);
    }
    if (this.sketchLine_) {
      sketchFeatures.push(this.sketchLine_);
    }
    if (this.sketchPoint_) {
      sketchFeatures.push(this.sketchPoint_);
    }
    const overlaySource = this.overlay_.getSource();
    overlaySource.clear(true);
    overlaySource.addFeatures(sketchFeatures);
  }
  /**
   * @private
   */
  updateState_() {
    const map = this.getMap();
    const active = this.getActive();
    if (!map || !active) {
      this.abortDrawing();
    }
    this.overlay_.setMap(active ? map : null);
  }
}
function getDefaultStyleFunction() {
  const styles = createEditingStyle();
  return function(feature, resolution) {
    return styles[feature.getGeometry().getType()];
  };
}
function getMode(type) {
  switch (type) {
    case "Point":
    case "MultiPoint":
      return "Point";
    case "LineString":
    case "MultiLineString":
      return "LineString";
    case "Polygon":
    case "MultiPolygon":
      return "Polygon";
    case "Circle":
      return "Circle";
    default:
      throw new Error("Invalid type: " + type);
  }
}
export {
  Draw as D,
  getTraceTargets as a,
  getCoordinate as b,
  getTraceTargetUpdate as g
};
