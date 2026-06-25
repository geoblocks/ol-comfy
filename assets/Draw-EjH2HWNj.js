import { A as createEditingStyle, B as MultiPoint, D as MapBrowserEvent, Dt as extend, E as MapBrowserEventType_default, F as VectorSource, G as Feature, H as LineString, It as FALSE, J as Polygon, Lt as TRUE, Mt as unlistenByKey, O as VectorLayer, Pt as BaseEvent, S as shiftKeyOnly, St as closestSquaredDistanceXY, Tt as createOrUpdateEmpty, V as MultiLineString, Z as Point, _t as clamp, at as fromUserCoordinate, bt as boundingExtent, ct as getUserProjection, et as getStrideForLayout, g as always, ht as squaredDistance$1, jt as listen, kt as getCenter, m as PointerInteraction, pt as distance, tt as Geometry, v as never, vt as squaredDistance, w as Property_default, y as noModifierKeys, yt as toFixed, z as MultiPolygon, zt as EventType_default } from "./overlay-layer-group-BsRRVz7F.js";
import { t as Circle } from "./Circle-DohvwKSI.js";
//#region node_modules/ol/geom/GeometryCollection.js
/**
* @module ol/geom/GeometryCollection
*/
/**
* @classdesc
* An array of {@link module:ol/geom/Geometry~Geometry} objects.
*
* @api
*/
var GeometryCollection = class GeometryCollection extends Geometry {
	/**
	* @param {Array<Geometry>} geometries Geometries.
	*/
	constructor(geometries) {
		super();
		/**
		* @private
		* @type {Array<Geometry>}
		*/
		this.geometries_ = geometries;
		/**
		* @private
		* @type {Array<import("../events.js").EventsKey>}
		*/
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) this.changeEventsKeys_.push(listen(geometries[i], EventType_default.CHANGE, this.changed, this));
	}
	/**
	* Make a complete copy of the geometry.
	* @return {!GeometryCollection} Clone.
	* @api
	* @override
	*/
	clone() {
		const geometryCollection = new GeometryCollection(cloneGeometries(this.geometries_));
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
		if (minSquaredDistance < closestSquaredDistanceXY(this.getExtent(), x, y)) return minSquaredDistance;
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) minSquaredDistance = geometries[i].closestPointXY(x, y, closestPoint, minSquaredDistance);
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) if (geometries[i].containsXY(x, y)) return true;
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) extend(extent, geometries[i].getExtent());
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
		/** @type {Array<Geometry>} */
		let geometriesArray = [];
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) if (geometries[i].getType() === this.getType()) geometriesArray = geometriesArray.concat(
			/** @type {GeometryCollection} */
			geometries[i].getGeometriesArrayRecursive()
		);
		else geometriesArray.push(geometries[i]);
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
		if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance < this.simplifiedGeometryMaxMinSquaredTolerance) return this;
		const simplifiedGeometries = [];
		const geometries = this.geometries_;
		let simplified = false;
		for (let i = 0, ii = geometries.length; i < ii; ++i) {
			const geometry = geometries[i];
			const simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
			simplifiedGeometries.push(simplifiedGeometry);
			if (simplifiedGeometry !== geometry) simplified = true;
		}
		if (simplified) return new GeometryCollection(simplifiedGeometries);
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) if (geometries[i].intersectsExtent(extent)) return true;
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].rotate(angle, anchor);
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
		if (!anchor) anchor = getCenter(this.getExtent());
		const geometries = this.geometries_;
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].scale(sx, sy, anchor);
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].applyTransform(transformFn);
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
		for (let i = 0, ii = geometries.length; i < ii; ++i) geometries[i].translate(deltaX, deltaY);
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
};
/**
* @param {Array<Geometry>} geometries Geometries.
* @return {Array<Geometry>} Cloned geometries.
*/
function cloneGeometries(geometries) {
	return geometries.map((geometry) => geometry.clone());
}
//#endregion
//#region node_modules/ol/interaction/tracing.js
/**
* Coordinate type when drawing lines.
* @typedef {Array<import("../coordinate.js").Coordinate>} LineCoordType
*/
/**
* @param {LineCoordType} coordinates The ring coordinates.
* @param {number} index The index.  May be wrapped.
* @return {import("../coordinate.js").Coordinate} The coordinate.
*/
function getCoordinate(coordinates, index) {
	const count = coordinates.length;
	if (index < 0) return coordinates[index + count];
	if (index >= count) return coordinates[index - count];
	return coordinates[index];
}
/**
* @param {LineCoordType} coordinates The coordinates.
* @param {number} index The index.  May be fractional and may wrap.
* @return {import("../coordinate.js").Coordinate} The interpolated coordinate.
*/
function interpolateCoordinate(coordinates, index) {
	const count = coordinates.length;
	let startIndex = Math.floor(index);
	const along = index - startIndex;
	if (startIndex >= count) startIndex -= count;
	else if (startIndex < 0) startIndex += count;
	let endIndex = startIndex + 1;
	if (endIndex >= count) endIndex -= count;
	const start = coordinates[startIndex];
	const x0 = start[0];
	const y0 = start[1];
	const end = coordinates[endIndex];
	const dx = end[0] - x0;
	const dy = end[1] - y0;
	return [x0 + dx * along, y0 + dy * along];
}
/**
* @typedef {Object} TraceTarget
* @property {Array<import("../coordinate.js").Coordinate>} coordinates Target coordinates.
* @property {boolean} ring The target coordinates are a linear ring.
* @property {number} startIndex The index of first traced coordinate.  A fractional index represents an
* edge intersection.  Index values for rings will wrap (may be negative or larger than coordinates length).
* @property {number} endIndex The index of last traced coordinate.  Details from startIndex also apply here.
*/
/**
* @typedef {Object} TraceState
* @property {boolean} active Tracing active.
* @property {import("../coordinate.js").Coordinate} [startCoord] The initially clicked coordinate.
* @property {Array<TraceTarget>} [targets] Targets available for tracing.
* @property {number} [targetIndex] The index of the currently traced target.  A value of -1 indicates
* that no trace target is active.
*/
/**
* @typedef {Object} TraceTargetUpdateInfo
* @property {number} index The new target index.
* @property {number} endIndex The new segment end index.
* @property {number} closestTargetDistance The squared distance to the closest target.
*/
/**
* @type {TraceTargetUpdateInfo}
*/
var sharedUpdateInfo = {
	index: -1,
	endIndex: NaN,
	closestTargetDistance: Infinity
};
/**
* @param {import("../coordinate.js").Coordinate} coordinate The coordinate.
* @param {TraceState} traceState The trace state.
* @param {import("../Map.js").default} map The map.
* @param {number} snapTolerance The snap tolerance.
* @return {TraceTargetUpdateInfo} Information about the new trace target.  The returned
* object is reused between calls and must not be modified by the caller.
*/
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
					if (endIndex < target.startIndex) endIndex += coordinates.length;
				} else if (target.endIndex < target.startIndex) {
					if (endIndex > target.startIndex) endIndex -= coordinates.length;
				}
			}
			newEndIndex = endIndex;
			newTargetIndex = targetIndex;
		}
	}
	const newTarget = traceState.targets[newTargetIndex];
	let considerBothDirections = newTarget.ring;
	if (traceState.targetIndex === newTargetIndex && considerBothDirections) {
		const newCoordinate = interpolateCoordinate(newTarget.coordinates, newEndIndex);
		if (distance(map.getPixelFromCoordinate(newCoordinate), map.getPixelFromCoordinate(traceState.startCoord)) > snapTolerance) considerBothDirections = false;
	}
	if (considerBothDirections) {
		const coordinates = newTarget.coordinates;
		const count = coordinates.length;
		const startIndex = newTarget.startIndex;
		const endIndex = newEndIndex;
		if (startIndex < endIndex) {
			const forwardDistance = getCumulativeSquaredDistance(coordinates, startIndex, endIndex);
			if (getCumulativeSquaredDistance(coordinates, startIndex, endIndex - count) < forwardDistance) newEndIndex -= count;
		} else {
			const reverseDistance = getCumulativeSquaredDistance(coordinates, startIndex, endIndex);
			if (getCumulativeSquaredDistance(coordinates, startIndex, endIndex + count) < reverseDistance) newEndIndex += count;
		}
	}
	sharedUpdateInfo.index = newTargetIndex;
	sharedUpdateInfo.endIndex = newEndIndex;
	sharedUpdateInfo.closestTargetDistance = closestTargetDistance;
	return sharedUpdateInfo;
}
/**
* @param {import("../coordinate.js").Coordinate} coordinate The coordinate.
* @param {Array<import("../Feature.js").default>} features The candidate features.
* @return {Array<TraceTarget>} The trace targets.
*/
function getTraceTargets(coordinate, features) {
	/**
	* @type {Array<TraceTarget>}
	*/
	const targets = [];
	for (let i = 0; i < features.length; ++i) appendGeometryTraceTargets(coordinate, features[i].getGeometry(), targets);
	return targets;
}
/**
* @param {import("../coordinate.js").Coordinate} coordinate The coordinate.
* @param {import("../geom/Geometry.js").default} geometry The candidate geometry.
* @param {Array<TraceTarget>} targets The trace targets.
*/
function appendGeometryTraceTargets(coordinate, geometry, targets) {
	if (geometry instanceof LineString) {
		appendTraceTarget(coordinate, geometry.getCoordinates(), false, targets);
		return;
	}
	if (geometry instanceof MultiLineString) {
		const coordinates = geometry.getCoordinates();
		for (let i = 0, ii = coordinates.length; i < ii; ++i) appendTraceTarget(coordinate, coordinates[i], false, targets);
		return;
	}
	if (geometry instanceof Polygon) {
		const coordinates = geometry.getCoordinates();
		for (let i = 0, ii = coordinates.length; i < ii; ++i) appendTraceTarget(coordinate, coordinates[i], true, targets);
		return;
	}
	if (geometry instanceof MultiPolygon) {
		const polys = geometry.getCoordinates();
		for (let i = 0, ii = polys.length; i < ii; ++i) {
			const coordinates = polys[i];
			for (let j = 0, jj = coordinates.length; j < jj; ++j) appendTraceTarget(coordinate, coordinates[j], true, targets);
		}
		return;
	}
	if (geometry instanceof GeometryCollection) {
		const geometries = geometry.getGeometries();
		for (let i = 0; i < geometries.length; ++i) appendGeometryTraceTargets(coordinate, geometries[i], targets);
		return;
	}
}
/**
* @param {import("../coordinate.js").Coordinate} coordinate The clicked coordinate.
* @param {Array<import("../coordinate.js").Coordinate>} coordinates The geometry component coordinates.
* @param {boolean} ring The coordinates represent a linear ring.
* @param {Array<TraceTarget>} targets The trace targets.
*/
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
/**
* @param {import("../coordinate.js").Coordinate} a One coordinate.
* @param {import("../coordinate.js").Coordinate} b Another coordinate.
* @return {number} The squared distance between the two coordinates.
*/
function getSquaredDistance(a, b) {
	return squaredDistance(a[0], a[1], b[0], b[1]);
}
/**
* Get the cumulative squared distance along a ring path.  The end index index may be "wrapped" and it may
* be less than the start index to indicate the direction of travel.  The start and end index may have
* a fractional part to indicate a point between two coordinates.
* @param {LineCoordType} coordinates Ring coordinates.
* @param {number} startIndex The start index.
* @param {number} endIndex The end index.
* @return {number} The cumulative squared distance along the ring path.
*/
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
	if (lowWholeIndex > highWholeIndex) return getSquaredDistance(interpolateCoordinate(coordinates, lowIndex), interpolateCoordinate(coordinates, highIndex));
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
/**
* @typedef {Object} PointSegmentRelationship
* @property {number} along The closest point expressed as a fraction along the segment length.
* @property {number} squaredDistance The squared distance of the point to the segment.
*/
/**
* @type {PointSegmentRelationship}
*/
var sharedRel = {
	along: 0,
	squaredDistance: 0
};
/**
* @param {number} x The point x.
* @param {number} y The point y.
* @param {import("../coordinate.js").Coordinate} start The segment start.
* @param {import("../coordinate.js").Coordinate} end The segment end.
* @return {PointSegmentRelationship} The point segment relationship.  The returned object is
* shared between calls and must not be modified by the caller.
*/
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
//#endregion
//#region node_modules/ol/interaction/Draw.js
/**
* @module ol/interaction/Draw
*/
/**
* @typedef {Object} Options
* @property {import("../geom/Geometry.js").Type} type Geometry type of
* the geometries being drawn with this instance.
* @property {number} [clickTolerance=6] The maximum distance in pixels between
* "down" and "up" for a "up" event to be considered a "click" event and
* actually add a point/vertex to the geometry being drawn.  The default of `6`
* was chosen for the draw interaction to behave correctly on mouse as well as
* on touch devices.
* @property {import("../Collection.js").default<Feature>} [features]
* Destination collection for the drawn features.
* @property {VectorSource} [source] Destination source for
* the drawn features.
* @property {number} [dragVertexDelay=500] Delay in milliseconds after pointerdown
* before the current vertex can be dragged to its exact position.
* @property {number} [snapTolerance=12] Pixel distance for snapping to the
* drawing finish. Must be greater than `0`.
* @property {boolean} [stopClick=false] Stop click, singleclick, and
* doubleclick events from firing during drawing.
* @property {number} [maxPoints] The number of points that can be drawn before
* a polygon ring or line string is finished. By default there is no
* restriction.
* @property {number} [minPoints] The number of points that must be drawn
* before a polygon ring or line string can be finished. Default is `3` for
* polygon rings and `2` for line strings.
* @property {import("../events/condition.js").Condition} [finishCondition] A function
* that takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
* boolean to indicate whether the drawing can be finished. Not used when drawing
* POINT or MULTI_POINT geometries.
* @property {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike} [style]
* Style for sketch features. The draw interaction can have up to three sketch features, depending on the mode.
* It will always contain a feature with a `Point` geometry that corresponds to the current cursor position.
* If the mode is `LineString` or `Polygon`, and there is at least one drawn point, it will also contain a feature with
* a `LineString` geometry that corresponds to the line between the already drawn points and the current cursor position.
* If the mode is `Polygon`, and there is at least one drawn point, it will also contain a feature with a `Polygon`
* geometry that corresponds to the polygon between the already drawn points and the current cursor position
* (note that this polygon has only two points if only one point is drawn).
* If the mode is `Circle`, and there is one point drawn, it will also contain a feature with a `Circle` geometry whose
* center is the drawn point and the radius is determined by the distance between the drawn point and the cursor.
* @property {GeometryFunction} [geometryFunction]
* Function that is called when a geometry's coordinates are updated.
* @property {string} [geometryName] Geometry name to use for features created
* by the draw interaction.
* @property {import("../events/condition.js").Condition} [condition] A function that
* takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
* boolean to indicate whether that event should be handled.
* By default {@link module:ol/events/condition.noModifierKeys}, i.e. a click,
* adds a vertex or deactivates freehand drawing.
* @property {boolean} [freehand=false] Operate in freehand mode for lines,
* polygons, and circles.  This makes the interaction always operate in freehand
* mode and takes precedence over any `freehandCondition` option.
* @property {import("../events/condition.js").Condition} [freehandCondition]
* Condition that activates freehand drawing for lines and polygons. This
* function takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and
* returns a boolean to indicate whether that event should be handled. The
* default is {@link module:ol/events/condition.shiftKeyOnly}, meaning that the
* Shift key activates freehand drawing.
* @property {boolean|import("../events/condition.js").Condition} [trace=false] Trace a portion of another geometry.
* Ignored when in freehand mode.
* @property {VectorSource} [traceSource] Source for features to trace.  If tracing is active and a `traceSource` is
* not provided, the interaction's `source` will be used.  Tracing requires that the interaction is configured with
* either a `traceSource` or a `source`.
* @property {boolean} [wrapX=false] Wrap the world horizontally on the sketch
* overlay.
* @property {import("../geom/Geometry.js").GeometryLayout} [geometryLayout='XY'] Layout of the
* feature geometries created by the draw interaction.
*/
/**
* Coordinate type when drawing points.
* @typedef {import("../coordinate.js").Coordinate} PointCoordType
*/
/**
* @typedef {import('./tracing.js').LineCoordType} LineCoordType
*/
/**
* Coordinate type when drawing polygons.
* @typedef {Array<Array<import("../coordinate.js").Coordinate>>} PolyCoordType
*/
/**
* Types used for drawing coordinates.
* @typedef {PointCoordType|LineCoordType|PolyCoordType} SketchCoordType
*/
/** @typedef {import('./tracing.js').TraceState} TraceState */
/** @typedef {import('./tracing.js').TraceTarget} TraceTarget */
/**
* Function that takes an array of coordinates and an optional existing geometry
* and a projection as arguments, and returns a geometry. The optional existing
* geometry is the geometry that is returned when the function is called without
* a second argument.
* @typedef {function(!SketchCoordType, import("../geom/SimpleGeometry.js").default,
*     import("../proj/Projection.js").default):
*     import("../geom/SimpleGeometry.js").default} GeometryFunction
*/
/**
* @typedef {'Point' | 'LineString' | 'Polygon' | 'Circle'} Mode
* Draw mode.  This collapses multi-part geometry types with their single-part
* cousins.
*/
/**
* @enum {string}
*/
var DrawEventType = {
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
/**
* @classdesc
* Events emitted by {@link module:ol/interaction/Draw~Draw} instances are
* instances of this type.
*/
var DrawEvent = class extends BaseEvent {
	/**
	* @param {DrawEventType} type Type.
	* @param {Feature} feature The feature drawn.
	*/
	constructor(type, feature) {
		super(type);
		/**
		* The feature being drawn.
		* @type {Feature}
		* @api
		*/
		this.feature = feature;
	}
};
/***
* @template Return
* @typedef {import("../Observable.js").OnSignature<import("../Observable.js").EventTypes, import("../events/Event.js").default, Return> &
*   import("../Observable.js").OnSignature<import("../ObjectEventType.js").Types|
*     'change:active', import("../Object.js").ObjectEvent, Return> &
*   import("../Observable.js").OnSignature<'drawabort'|'drawend'|'drawstart', DrawEvent, Return> &
*   import("../Observable.js").CombinedOnSignature<import("../Observable.js").EventTypes|import("../ObjectEventType.js").Types|
*     'change:active'|'drawabort'|'drawend'|'drawstart', Return>} DrawOnSignature
*/
/**
* @classdesc
* Interaction for drawing feature geometries.
*
* @fires DrawEvent
* @api
*/
var Draw = class extends PointerInteraction {
	/**
	* @param {Options} options Options.
	*/
	constructor(options) {
		const pointerOptions = options;
		if (!pointerOptions.stopDown) pointerOptions.stopDown = FALSE;
		super(pointerOptions);
		/***
		* @type {DrawOnSignature<import("../events.js").EventsKey>}
		*/
		this.on;
		/***
		* @type {DrawOnSignature<import("../events.js").EventsKey>}
		*/
		this.once;
		/***
		* @type {DrawOnSignature<void>}
		*/
		this.un;
		/**
		* @type {Options}
		* @private
		*/
		this.options_ = options;
		/**
		* @type {boolean}
		* @private
		*/
		this.shouldHandle_ = false;
		/**
		* @type {import("../pixel.js").Pixel}
		* @private
		*/
		this.downPx_ = null;
		/**
		* @type {ReturnType<typeof setTimeout>}
		* @private
		*/
		this.downTimeout_;
		/**
		* @type {number|undefined}
		* @private
		*/
		this.lastDragTime_;
		/**
		* Pointer type of the last pointermove event
		* @type {string}
		* @private
		*/
		this.pointerType_;
		/**
		* @type {boolean}
		* @private
		*/
		this.freehand_ = false;
		/**
		* Target source for drawn features.
		* @type {VectorSource|null}
		* @private
		*/
		this.source_ = options.source ? options.source : null;
		/**
		* Target collection for drawn features.
		* @type {import("../Collection.js").default<Feature>|null}
		* @private
		*/
		this.features_ = options.features ? options.features : null;
		/**
		* Pixel distance for snapping.
		* @type {number}
		* @private
		*/
		this.snapTolerance_ = options.snapTolerance ? options.snapTolerance : 12;
		/**
		* Geometry type.
		* @type {import("../geom/Geometry.js").Type}
		* @private
		*/
		this.type_ = options.type;
		/**
		* Drawing mode (derived from geometry type.
		* @type {Mode}
		* @private
		*/
		this.mode_ = getMode(this.type_);
		/**
		* Stop click, singleclick, and doubleclick events from firing during drawing.
		* Default is `false`.
		* @type {boolean}
		* @private
		*/
		this.stopClick_ = !!options.stopClick;
		/**
		* Ignore the next up event. This is set to `true` when a drag event is encountered,
		* e.g. when the user pans the map while drawing. In this case, we do not want to bail
		* out of tracing.
		* @type {boolean}
		* @private
		*/
		this.ignoreNextUpEvent_ = false;
		/**
		* The number of points that must be drawn before a polygon ring or line
		* string can be finished.  The default is 3 for polygon rings and 2 for
		* line strings.
		* @type {number}
		* @private
		*/
		this.minPoints_ = options.minPoints ? options.minPoints : this.mode_ === "Polygon" ? 3 : 2;
		/**
		* The number of points that can be drawn before a polygon ring or line string
		* is finished. The default is no restriction.
		* @type {number}
		* @private
		*/
		this.maxPoints_ = this.mode_ === "Circle" ? 2 : options.maxPoints ? options.maxPoints : Infinity;
		/**
		* A function to decide if a potential finish coordinate is permissible
		* @private
		* @type {import("../events/condition.js").Condition}
		*/
		this.finishCondition_ = options.finishCondition ? options.finishCondition : TRUE;
		/**
		* @private
		* @type {import("../geom/Geometry.js").GeometryLayout}
		*/
		this.geometryLayout_ = options.geometryLayout ? options.geometryLayout : "XY";
		let geometryFunction = options.geometryFunction;
		if (!geometryFunction) {
			const mode = this.mode_;
			if (mode === "Circle")
 /**
			* @param {!LineCoordType} coordinates The coordinates.
			* @param {import("../geom/SimpleGeometry.js").default|undefined} geometry Optional geometry.
			* @param {import("../proj/Projection.js").default} projection The view projection.
			* @return {import("../geom/SimpleGeometry.js").default} A geometry.
			*/
			geometryFunction = (coordinates, geometry, projection) => {
				const circle = geometry ? geometry : new Circle([NaN, NaN]);
				const center = fromUserCoordinate(coordinates[0], projection);
				const squaredLength = squaredDistance$1(center, fromUserCoordinate(coordinates[coordinates.length - 1], projection));
				circle.setCenterAndRadius(center, Math.sqrt(squaredLength), this.geometryLayout_);
				const userProjection = getUserProjection();
				if (userProjection) circle.transform(projection, userProjection);
				return circle;
			};
			else {
				let Constructor;
				if (mode === "Point") Constructor = Point;
				else if (mode === "LineString") Constructor = LineString;
				else if (mode === "Polygon") Constructor = Polygon;
				/**
				* @param {!LineCoordType} coordinates The coordinates.
				* @param {import("../geom/SimpleGeometry.js").default|undefined} geometry Optional geometry.
				* @param {import("../proj/Projection.js").default} projection The view projection.
				* @return {import("../geom/SimpleGeometry.js").default} A geometry.
				*/
				geometryFunction = (coordinates, geometry, projection) => {
					if (geometry) if (mode === "Polygon") if (coordinates[0].length) geometry.setCoordinates([coordinates[0].concat([coordinates[0][0]])], this.geometryLayout_);
					else geometry.setCoordinates([], this.geometryLayout_);
					else geometry.setCoordinates(coordinates, this.geometryLayout_);
					else geometry = new Constructor(coordinates, this.geometryLayout_);
					return geometry;
				};
			}
		}
		/**
		* @type {GeometryFunction}
		* @private
		*/
		this.geometryFunction_ = geometryFunction;
		/**
		* @type {number}
		* @private
		*/
		this.dragVertexDelay_ = options.dragVertexDelay !== void 0 ? options.dragVertexDelay : 500;
		/**
		* Finish coordinate for the feature (first point for polygons, last point for
		* linestrings).
		* @type {import("../coordinate.js").Coordinate}
		* @private
		*/
		this.finishCoordinate_ = null;
		/**
		* Sketch feature.
		* @type {Feature<import('../geom/SimpleGeometry.js').default>}
		* @private
		*/
		this.sketchFeature_ = null;
		/**
		* Sketch point.
		* @type {Feature<Point>}
		* @private
		*/
		this.sketchPoint_ = null;
		/**
		* Sketch coordinates. Used when drawing a line or polygon.
		* @type {SketchCoordType}
		* @private
		*/
		this.sketchCoords_ = null;
		/**
		* Sketch line. Used when drawing polygon.
		* @type {Feature<LineString>}
		* @private
		*/
		this.sketchLine_ = null;
		/**
		* Sketch line coordinates. Used when drawing a polygon or circle.
		* @type {LineCoordType}
		* @private
		*/
		this.sketchLineCoords_ = null;
		/**
		* Squared tolerance for handling up events.  If the squared distance
		* between a down and up event is greater than this tolerance, up events
		* will not be handled.
		* @type {number}
		* @private
		*/
		this.squaredClickTolerance_ = options.clickTolerance ? options.clickTolerance * options.clickTolerance : 36;
		/**
		* Draw overlay where our sketch features are drawn.
		* @type {VectorLayer}
		* @private
		*/
		this.overlay_ = new VectorLayer({
			source: new VectorSource({
				useSpatialIndex: false,
				wrapX: options.wrapX ? options.wrapX : false
			}),
			style: options.style ? options.style : getDefaultStyleFunction(),
			updateWhileInteracting: true
		});
		/**
		* Name of the geometry attribute for newly created features.
		* @type {string|undefined}
		* @private
		*/
		this.geometryName_ = options.geometryName;
		/**
		* @private
		* @type {import("../events/condition.js").Condition}
		*/
		this.condition_ = options.condition ? options.condition : noModifierKeys;
		/**
		* @private
		* @type {import("../events/condition.js").Condition}
		*/
		this.freehandCondition_;
		if (options.freehand) this.freehandCondition_ = always;
		else this.freehandCondition_ = options.freehandCondition ? options.freehandCondition : shiftKeyOnly;
		/**
		* @type {import("../events/condition.js").Condition}
		* @private
		*/
		this.traceCondition_;
		this.setTrace(options.trace || false);
		/**
		* @type {TraceState}
		* @private
		*/
		this.traceState_ = { active: false };
		/**
		* @type {VectorSource|null}
		* @private
		*/
		this.traceSource_ = options.traceSource || options.source || null;
		this.addChangeListener(Property_default.ACTIVE, this.updateState_);
	}
	/**
	* Toggle tracing mode or set a tracing condition.
	*
	* @param {boolean|import("../events/condition.js").Condition} trace A boolean to toggle tracing mode or an event
	*     condition that will be checked when a feature is clicked to determine if tracing should be active.
	*/
	setTrace(trace) {
		let condition;
		if (!trace) condition = never;
		else if (trace === true) condition = always;
		else condition = trace;
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
		if (this.freehand_) this.freehandCondition_ = always;
		else this.freehandCondition_ = this.options_ && this.options_.freehandCondition ? this.options_.freehandCondition : shiftKeyOnly;
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
		if (event.originalEvent.type === EventType_default.CONTEXTMENU) event.originalEvent.preventDefault();
		this.freehand_ = this.mode_ !== "Point" && this.freehandCondition_(event);
		let move = event.type === MapBrowserEventType_default.POINTERMOVE;
		let pass = true;
		if (!this.freehand_ && this.lastDragTime_ && event.type === MapBrowserEventType_default.POINTERDRAG) {
			if (Date.now() - this.lastDragTime_ >= this.dragVertexDelay_) {
				this.downPx_ = event.pixel;
				this.shouldHandle_ = !this.freehand_;
				move = true;
			} else this.lastDragTime_ = void 0;
			if (this.shouldHandle_ && this.downTimeout_ !== void 0) {
				clearTimeout(this.downTimeout_);
				this.downTimeout_ = void 0;
			}
		}
		if (this.freehand_ && event.type === MapBrowserEventType_default.POINTERDRAG && this.sketchFeature_ !== null) {
			this.addToDrawing_(event.coordinate);
			pass = false;
		} else if (this.freehand_ && event.type === MapBrowserEventType_default.POINTERDOWN) pass = false;
		else if (move && this.getPointerCount() < 2) {
			pass = event.type === MapBrowserEventType_default.POINTERMOVE;
			if (pass && this.freehand_) {
				this.handlePointerMove_(event);
				if (this.shouldHandle_) event.originalEvent.preventDefault();
			} else if (event.originalEvent.pointerType === "mouse" || event.type === MapBrowserEventType_default.POINTERDRAG && this.downTimeout_ === void 0) this.handlePointerMove_(event);
		} else if (event.type === MapBrowserEventType_default.DBLCLICK) pass = false;
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
			if (!this.finishCoordinate_) this.startDrawing_(event.coordinate);
			return true;
		}
		if (!this.condition_(event)) {
			this.lastDragTime_ = void 0;
			return false;
		}
		this.lastDragTime_ = Date.now();
		this.downTimeout_ = setTimeout(() => {
			this.handlePointerMove_(new MapBrowserEvent(MapBrowserEventType_default.POINTERMOVE, event.map, event.originalEvent, false, event.frameState));
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
		if (!this.traceSource_ || !this.traceCondition_(event)) return;
		if (this.traceState_.active) {
			this.deactivateTrace_();
			return;
		}
		const map = this.getMap();
		const extent = boundingExtent([map.getCoordinateFromPixel([event.pixel[0] - this.snapTolerance_, event.pixel[1] + this.snapTolerance_]), map.getCoordinateFromPixel([event.pixel[0] + this.snapTolerance_, event.pixel[1] - this.snapTolerance_])]);
		const features = this.traceSource_.getFeaturesInExtent(extent);
		if (features.length === 0) return;
		const targets = getTraceTargets(event.coordinate, features);
		if (targets.length) this.traceState_ = {
			active: true,
			startCoord: event.coordinate.slice(),
			targets,
			targetIndex: -1
		};
	}
	/**
	* @param {TraceTarget} target The trace target.
	* @param {number} endIndex The new end index of the trace.
	* @private
	*/
	addOrRemoveTracedCoordinates_(target, endIndex) {
		const previouslyForward = target.startIndex <= target.endIndex;
		if (previouslyForward === target.startIndex <= endIndex) {
			if (previouslyForward && endIndex > target.endIndex || !previouslyForward && endIndex < target.endIndex) this.addTracedCoordinates_(target, target.endIndex, endIndex);
			else if (previouslyForward && endIndex < target.endIndex || !previouslyForward && endIndex > target.endIndex) this.removeTracedCoordinates_(endIndex, target.endIndex);
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
		if (fromIndex === toIndex) return;
		let remove = 0;
		if (fromIndex < toIndex) {
			const start = Math.ceil(fromIndex);
			let end = Math.floor(toIndex);
			if (end === toIndex) end -= 1;
			remove = end - start + 1;
		} else {
			const start = Math.floor(fromIndex);
			let end = Math.ceil(toIndex);
			if (end === toIndex) end += 1;
			remove = start - end + 1;
		}
		if (remove > 0) this.removeLastPoints_(remove);
	}
	/**
	* @param {TraceTarget} target The trace target.
	* @param {number} fromIndex The start index.
	* @param {number} toIndex The end index.
	* @private
	*/
	addTracedCoordinates_(target, fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const coordinates = [];
		if (fromIndex < toIndex) {
			const start = Math.ceil(fromIndex);
			let end = Math.floor(toIndex);
			if (end === toIndex) end -= 1;
			for (let i = start; i <= end; ++i) coordinates.push(getCoordinate(target.coordinates, i));
		} else {
			const start = Math.floor(fromIndex);
			let end = Math.ceil(toIndex);
			if (end === toIndex) end += 1;
			for (let i = start; i >= end; --i) coordinates.push(getCoordinate(target.coordinates, i));
		}
		if (coordinates.length) this.appendCoordinates(coordinates);
	}
	/**
	* Update the trace.
	* @param {import("../MapBrowserEvent.js").default} event Event.
	* @private
	*/
	updateTrace_(event) {
		const traceState = this.traceState_;
		if (!traceState.active) return;
		if (traceState.targetIndex === -1) {
			if (distance(event.map.getPixelFromCoordinate(traceState.startCoord), event.pixel) < this.snapTolerance_) return;
		}
		const updatedTraceTarget = getTraceTargetUpdate(event.coordinate, traceState, this.getMap(), this.snapTolerance_);
		if (traceState.targetIndex !== updatedTraceTarget.index) {
			if (traceState.targetIndex !== -1) {
				const oldTarget = traceState.targets[traceState.targetIndex];
				this.removeTracedCoordinates_(oldTarget.startIndex, oldTarget.endIndex);
			}
			const newTarget = traceState.targets[updatedTraceTarget.index];
			this.addTracedCoordinates_(newTarget, newTarget.startIndex, updatedTraceTarget.endIndex);
		} else {
			const target = traceState.targets[traceState.targetIndex];
			this.addOrRemoveTracedCoordinates_(target, updatedTraceTarget.endIndex);
		}
		traceState.targetIndex = updatedTraceTarget.index;
		const target = traceState.targets[traceState.targetIndex];
		target.endIndex = updatedTraceTarget.endIndex;
		const coordinate = interpolateCoordinate(target.coordinates, target.endIndex);
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
			if (!this.ignoreNextUpEvent_) this.toggleTraceState_(event);
			if (this.shouldHandle_) {
				const startingToDraw = !this.finishCoordinate_;
				if (startingToDraw) this.startDrawing_(event.coordinate);
				if (!startingToDraw && this.freehand_) this.finishDrawing();
				else if (!this.freehand_ && (!startingToDraw || this.mode_ === "Point")) if (this.atFinish_(event.pixel, tracing)) {
					if (this.finishCondition_(event)) this.finishDrawing();
				} else this.addToDrawing_(event.coordinate);
				pass = false;
			} else if (this.freehand_) this.abortDrawing();
		}
		this.ignoreNextUpEvent_ = false;
		if (!pass && this.stopClick_) event.preventDefault();
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
			const squaredDistance = dx * dx + dy * dy;
			this.shouldHandle_ = this.freehand_ ? squaredDistance > this.squaredClickTolerance_ : squaredDistance <= this.squaredClickTolerance_;
			if (!this.shouldHandle_) return;
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
			if (mode === "Point") at = true;
			else if (mode === "Circle") at = this.sketchCoords_.length === 2;
			else if (mode === "LineString") potentiallyDone = !tracing && this.sketchCoords_.length > this.minPoints_;
			else if (mode === "Polygon") {
				const sketchCoords = this.sketchCoords_;
				potentiallyDone = sketchCoords[0].length > this.minPoints_;
				potentiallyFinishCoordinates = [sketchCoords[0][0], sketchCoords[0][sketchCoords[0].length - 2]];
				if (tracing) potentiallyFinishCoordinates = [sketchCoords[0][0]];
				else potentiallyFinishCoordinates = [sketchCoords[0][0], sketchCoords[0][sketchCoords[0].length - 2]];
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
	* @param {import("../coordinate.js").Coordinate} coordinates Coordinate.
	* @private
	*/
	createOrUpdateSketchPoint_(coordinates) {
		if (!this.sketchPoint_) {
			this.sketchPoint_ = new Feature(new Point(coordinates));
			this.updateSketchFeatures_();
		} else this.sketchPoint_.getGeometry().setCoordinates(coordinates);
	}
	/**
	* @param {import("../geom/Polygon.js").default} geometry Polygon geometry.
	* @private
	*/
	createOrUpdateCustomSketchLine_(geometry) {
		if (!this.sketchLine_) this.sketchLine_ = new Feature();
		const ring = geometry.getLinearRing(0);
		let sketchLineGeom = this.sketchLine_.getGeometry();
		if (!sketchLineGeom) {
			sketchLineGeom = new LineString(ring.getFlatCoordinates(), ring.getLayout());
			this.sketchLine_.setGeometry(sketchLineGeom);
		} else {
			sketchLineGeom.setFlatCoordinates(ring.getLayout(), ring.getFlatCoordinates());
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
		while (start.length < stride) start.push(0);
		this.finishCoordinate_ = start;
		if (this.mode_ === "Point") this.sketchCoords_ = start.slice();
		else if (this.mode_ === "Polygon") {
			this.sketchCoords_ = [[start.slice(), start.slice()]];
			this.sketchLineCoords_ = this.sketchCoords_[0];
		} else this.sketchCoords_ = [start.slice(), start.slice()];
		if (this.sketchLineCoords_) this.sketchLine_ = new Feature(new LineString(this.sketchLineCoords_));
		const geometry = this.geometryFunction_(this.sketchCoords_, void 0, projection);
		this.sketchFeature_ = new Feature();
		if (this.geometryName_) this.sketchFeature_.setGeometryName(this.geometryName_);
		this.sketchFeature_.setGeometry(geometry);
		this.updateSketchFeatures_();
		this.dispatchEvent(new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_));
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
		while (coordinate.length < stride) coordinate.push(0);
		if (this.mode_ === "Point") last = this.sketchCoords_;
		else if (this.mode_ === "Polygon") {
			coordinates = this.sketchCoords_[0];
			last = coordinates[coordinates.length - 1];
			if (this.atFinish_(map.getPixelFromCoordinate(coordinate))) coordinate = this.finishCoordinate_.slice();
		} else {
			coordinates = this.sketchCoords_;
			last = coordinates[coordinates.length - 1];
		}
		last[0] = coordinate[0];
		last[1] = coordinate[1];
		this.geometryFunction_(this.sketchCoords_, geometry, projection);
		if (this.sketchPoint_) this.sketchPoint_.getGeometry().setCoordinates(coordinate);
		if (geometry.getType() === "Polygon" && this.mode_ !== "Polygon") this.createOrUpdateCustomSketchLine_(geometry);
		else if (this.sketchLineCoords_) this.sketchLine_.getGeometry().setCoordinates(this.sketchLineCoords_);
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
			coordinates = this.sketchCoords_;
			if (coordinates.length >= this.maxPoints_) if (this.freehand_) coordinates.pop();
			else done = true;
			coordinates.push(coordinate.slice());
			this.geometryFunction_(coordinates, geometry, projection);
		} else if (mode === "Polygon") {
			coordinates = this.sketchCoords_[0];
			if (coordinates.length >= this.maxPoints_) if (this.freehand_) coordinates.pop();
			else done = true;
			coordinates.push(coordinate.slice());
			if (done) this.finishCoordinate_ = coordinates[0];
			this.geometryFunction_(this.sketchCoords_, geometry, projection);
		}
		this.createOrUpdateSketchPoint_(coordinate.slice());
		this.updateSketchFeatures_();
		if (done) return this.finishDrawing();
		return this.sketchFeature_;
	}
	/**
	* @param {number} n The number of points to remove.
	*/
	removeLastPoints_(n) {
		if (!this.sketchFeature_) return;
		const geometry = this.sketchFeature_.getGeometry();
		const projection = this.getMap().getView().getProjection();
		const mode = this.mode_;
		for (let i = 0; i < n; ++i) {
			let coordinates;
			if (mode === "LineString" || mode === "Circle") {
				coordinates = this.sketchCoords_;
				coordinates.splice(-2, 1);
				if (coordinates.length >= 2) {
					this.finishCoordinate_ = coordinates[coordinates.length - 2].slice();
					const finishCoordinate = this.finishCoordinate_.slice();
					coordinates[coordinates.length - 1] = finishCoordinate;
					this.createOrUpdateSketchPoint_(finishCoordinate);
				}
				this.geometryFunction_(coordinates, geometry, projection);
				if (geometry.getType() === "Polygon" && this.sketchLine_) this.createOrUpdateCustomSketchLine_(geometry);
			} else if (mode === "Polygon") {
				coordinates = this.sketchCoords_[0];
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
		if (!sketchFeature) return null;
		let coordinates = this.sketchCoords_;
		const geometry = sketchFeature.getGeometry();
		const projection = this.getMap().getView().getProjection();
		if (this.mode_ === "LineString") {
			coordinates.pop();
			this.geometryFunction_(coordinates, geometry, projection);
		} else if (this.mode_ === "Polygon") {
			/** @type {PolyCoordType} */ coordinates[0].pop();
			this.geometryFunction_(coordinates, geometry, projection);
			coordinates = geometry.getCoordinates();
		}
		if (this.type_ === "MultiPoint") sketchFeature.setGeometry(new MultiPoint([coordinates]));
		else if (this.type_ === "MultiLineString") sketchFeature.setGeometry(new MultiLineString([coordinates]));
		else if (this.type_ === "MultiPolygon") sketchFeature.setGeometry(new MultiPolygon([coordinates]));
		this.dispatchEvent(new DrawEvent(DrawEventType.DRAWEND, sketchFeature));
		if (this.features_) this.features_.push(sketchFeature);
		if (this.source_) this.source_.addFeature(sketchFeature);
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
		if (sketchFeature) this.dispatchEvent(new DrawEvent(DrawEventType.DRAWABORT, sketchFeature));
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
		if (newDrawing) this.startDrawing_(coordinates[0]);
		/** @type {LineCoordType} */
		let sketchCoords;
		if (mode === "LineString" || mode === "Circle") sketchCoords = this.sketchCoords_;
		else if (mode === "Polygon") sketchCoords = this.sketchCoords_ && this.sketchCoords_.length ? this.sketchCoords_[0] : [];
		else return;
		if (newDrawing) sketchCoords.shift();
		sketchCoords.pop();
		for (let i = 0; i < coordinates.length; i++) this.addToDrawing_(coordinates[i]);
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
		const lineString = feature.getGeometry();
		this.sketchFeature_ = feature;
		this.sketchCoords_ = lineString.getCoordinates();
		const last = this.sketchCoords_[this.sketchCoords_.length - 1];
		this.finishCoordinate_ = last.slice();
		this.sketchCoords_.push(last.slice());
		this.sketchPoint_ = new Feature(new Point(last));
		this.updateSketchFeatures_();
		this.dispatchEvent(new DrawEvent(DrawEventType.DRAWSTART, this.sketchFeature_));
	}
	/**
	* Redraw the sketch features.
	* @private
	*/
	updateSketchFeatures_() {
		const sketchFeatures = [];
		if (this.sketchFeature_) sketchFeatures.push(this.sketchFeature_);
		if (this.sketchLine_) sketchFeatures.push(this.sketchLine_);
		if (this.sketchPoint_) sketchFeatures.push(this.sketchPoint_);
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
		if (!map || !active) this.abortDrawing();
		this.overlay_.setMap(active ? map : null);
	}
};
/**
* @return {import("../style/Style.js").StyleFunction} Styles.
*/
function getDefaultStyleFunction() {
	const styles = createEditingStyle();
	return function(feature, resolution) {
		return styles[feature.getGeometry().getType()];
	};
}
/**
* Get the drawing mode.  The mode for multi-part geometries is the same as for
* their single-part cousins.
* @param {import("../geom/Geometry.js").Type} type Geometry type.
* @return {Mode} Drawing mode.
*/
function getMode(type) {
	switch (type) {
		case "Point":
		case "MultiPoint": return "Point";
		case "LineString":
		case "MultiLineString": return "LineString";
		case "Polygon":
		case "MultiPolygon": return "Polygon";
		case "Circle": return "Circle";
		default: throw new Error("Invalid type: " + type);
	}
}
//#endregion
export { getTraceTargets as i, getCoordinate as n, getTraceTargetUpdate as r, Draw as t };
