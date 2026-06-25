import { A as createEditingStyle, At as intersects, C as singleClick, Ct as createEmpty, E as MapBrowserEventType_default, Et as createOrUpdateFromCoordinate, F as VectorSource, Ft as clear, G as Feature, I as VectorEventType_default, It as FALSE, K as TileLayer, L as RBush, Lt as TRUE, M as Fill, Mt as unlistenByKey, N as CircleStyle, Nt as getUid, O as VectorLayer, P as OSM, Pt as BaseEvent, R as RenderFeature, Rt as equals$1, U as Collection, W as CollectionEventType_default, X as getIntersectionPoint, Y as fromCircle, Z as Point, _ as click, at as fromUserCoordinate, b as platformModifierKeyOnly, bt as boundingExtent, ct as getUserProjection, dt as closestOnCircle, ft as closestOnSegment, g as always, gt as squaredDistanceToSegment, h as altKeyOnly, ht as squaredDistance, it as unByKey, j as Stroke, jt as listen, k as Style, lt as toUserCoordinate, m as PointerInteraction, mt as equals, ot as fromUserExtent, pt as distance, q as View, rt as ObjectEventType_default, u as overEvery, ut as toUserExtent, v as never, w as Property_default, x as primaryAction, xt as buffer, zt as EventType_default } from "../../overlay-layer-group-BsRRVz7F.js";
import { i as getTraceTargets, n as getCoordinate, r as getTraceTargetUpdate, t as Draw } from "../../Draw-EjH2HWNj.js";
import { t as storeManager } from "../../store-manager-B_VMzd37.js";
//#region node_modules/ol/interaction/Translate.js
/**
* @module ol/interaction/Translate
*/
/**
* @enum {string}
*/
var TranslateEventType = {
	/**
	* Triggered upon feature translation start.
	* @event TranslateEvent#translatestart
	* @api
	*/
	TRANSLATESTART: "translatestart",
	/**
	* Triggered upon feature translation.
	* @event TranslateEvent#translating
	* @api
	*/
	TRANSLATING: "translating",
	/**
	* Triggered upon feature translation end.
	* @event TranslateEvent#translateend
	* @api
	*/
	TRANSLATEEND: "translateend"
};
/**
* A function that takes a {@link module:ol/Feature~Feature} or
* {@link module:ol/render/Feature~RenderFeature} and a
* {@link module:ol/layer/Layer~Layer} and returns `true` if the feature may be
* translated or `false` otherwise.
* @typedef {function(Feature, import("../layer/Layer.js").default<import("../source/Source.js").default>):boolean} FilterFunction
*/
/**
* @typedef {Object} Options
* @property {import("../events/condition.js").Condition} [condition] A function that
* takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
* boolean to indicate whether that event should be handled.
* Default is {@link module:ol/events/condition.always}.
* @property {Collection<Feature>} [features] Features contained in this collection will be able to be translated together.
* @property {Array<import("../layer/Layer.js").default>|function(import("../layer/Layer.js").default<import("../source/Source.js").default>): boolean} [layers] A list of layers from which features should be
* translated. Alternatively, a filter function can be provided. The
* function will be called for each layer in the map and should return
* `true` for layers that you want to be translatable. If the option is
* absent, all visible layers will be considered translatable.
* Not used if `features` is provided.
* @property {FilterFunction} [filter] A function
* that takes a {@link module:ol/Feature~Feature} and an
* {@link module:ol/layer/Layer~Layer} and returns `true` if the feature may be
* translated or `false` otherwise. Not used if `features` is provided.
* @property {number} [hitTolerance=0] Hit-detection tolerance. Pixels inside the radius around the given position
* will be checked for features.
*/
/**
* @classdesc
* Events emitted by {@link module:ol/interaction/Translate~Translate} instances
* are instances of this type.
*/
var TranslateEvent = class extends BaseEvent {
	/**
	* @param {TranslateEventType} type Type.
	* @param {Collection<Feature>} features The features translated.
	* @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
	* @param {import("../coordinate.js").Coordinate} startCoordinate The original coordinates before.translation started
	* @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
	*/
	constructor(type, features, coordinate, startCoordinate, mapBrowserEvent) {
		super(type);
		/**
		* The features being translated.
		* @type {Collection<Feature>}
		* @api
		*/
		this.features = features;
		/**
		* The coordinate of the drag event.
		* @const
		* @type {import("../coordinate.js").Coordinate}
		* @api
		*/
		this.coordinate = coordinate;
		/**
		* The coordinate of the start position before translation started.
		* @const
		* @type {import("../coordinate.js").Coordinate}
		* @api
		*/
		this.startCoordinate = startCoordinate;
		/**
		* Associated {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
		* @type {import("../MapBrowserEvent.js").default}
		* @api
		*/
		this.mapBrowserEvent = mapBrowserEvent;
	}
};
/***
* @template Return
* @typedef {import("../Observable.js").OnSignature<import("../Observable.js").EventTypes, import("../events/Event.js").default, Return> &
*   import("../Observable.js").OnSignature<import("../ObjectEventType.js").Types|
*     'change:active', import("../Object.js").ObjectEvent, Return> &
*   import("../Observable.js").OnSignature<'translateend'|'translatestart'|'translating', TranslateEvent, Return> &
*   import("../Observable.js").CombinedOnSignature<import("../Observable.js").EventTypes|import("../ObjectEventType.js").Types|
*     'change:active'|'translateend'|'translatestart'|'translating', Return>} TranslateOnSignature
*/
/**
* @classdesc
* Interaction for translating (moving) features.
* If you want to translate multiple features in a single action (for example,
* the collection used by a select interaction), construct the interaction with
* the `features` option.
*
* @fires TranslateEvent
* @api
*/
var Translate = class extends PointerInteraction {
	/**
	* @param {Options} [options] Options.
	*/
	constructor(options) {
		options = options ? options : {};
		super(options);
		/***
		* @type {TranslateOnSignature<import("../events.js").EventsKey>}
		*/
		this.on;
		/***
		* @type {TranslateOnSignature<import("../events.js").EventsKey>}
		*/
		this.once;
		/***
		* @type {TranslateOnSignature<void>}
		*/
		this.un;
		/**
		* The last position we translated to.
		* @type {import("../coordinate.js").Coordinate}
		* @private
		*/
		this.lastCoordinate_ = null;
		/**
		* The start position before translation started.
		* @type {import("../coordinate.js").Coordinate}
		* @private
		*/
		this.startCoordinate_ = null;
		/**
		* @type {Collection<Feature>|null}
		* @private
		*/
		this.features_ = options.features !== void 0 ? options.features : null;
		/** @type {function(import("../layer/Layer.js").default<import("../source/Source.js").default>): boolean} */
		let layerFilter;
		if (options.layers && !this.features_) if (typeof options.layers === "function") layerFilter = options.layers;
		else {
			const layers = options.layers;
			layerFilter = function(layer) {
				return layers.includes(layer);
			};
		}
		else layerFilter = TRUE;
		/**
		* @private
		* @type {function(import("../layer/Layer.js").default<import("../source/Source.js").default>): boolean}
		*/
		this.layerFilter_ = layerFilter;
		/**
		* @private
		* @type {FilterFunction}
		*/
		this.filter_ = options.filter && !this.features_ ? options.filter : TRUE;
		/**
		* @private
		* @type {number}
		*/
		this.hitTolerance_ = options.hitTolerance ? options.hitTolerance : 0;
		/**
		* @private
		* @type {import("../events/condition.js").Condition}
		*/
		this.condition_ = options.condition ? options.condition : always;
		/**
		* @type {Feature}
		* @private
		*/
		this.lastFeature_ = null;
		this.addChangeListener(Property_default.ACTIVE, this.handleActiveChanged_);
	}
	/**
	* Handle pointer down events.
	* @param {import("../MapBrowserEvent.js").default} event Event.
	* @return {boolean} If the event was consumed.
	* @override
	*/
	handleDownEvent(event) {
		if (!event.originalEvent || !this.condition_(event)) return false;
		this.lastFeature_ = this.featuresAtPixel_(event.pixel, event.map);
		if (!this.lastCoordinate_ && this.lastFeature_) {
			this.startCoordinate_ = event.coordinate;
			this.lastCoordinate_ = event.coordinate;
			this.handleMoveEvent(event);
			const features = this.features_ || new Collection([this.lastFeature_]);
			this.dispatchEvent(new TranslateEvent(TranslateEventType.TRANSLATESTART, features, event.coordinate, this.startCoordinate_, event));
			return true;
		}
		return false;
	}
	/**
	* Handle pointer up events.
	* @param {import("../MapBrowserEvent.js").default} event Event.
	* @return {boolean} If the event was consumed.
	* @override
	*/
	handleUpEvent(event) {
		if (this.lastCoordinate_) {
			this.lastCoordinate_ = null;
			this.handleMoveEvent(event);
			const features = this.features_ || new Collection([this.lastFeature_]);
			this.dispatchEvent(new TranslateEvent(TranslateEventType.TRANSLATEEND, features, event.coordinate, this.startCoordinate_, event));
			this.startCoordinate_ = null;
			return true;
		}
		return false;
	}
	/**
	* Handle pointer drag events.
	* @param {import("../MapBrowserEvent.js").default} event Event.
	* @override
	*/
	handleDragEvent(event) {
		if (this.lastCoordinate_) {
			const newCoordinate = event.coordinate;
			const projection = event.map.getView().getProjection();
			const newViewCoordinate = fromUserCoordinate(newCoordinate, projection);
			const lastViewCoordinate = fromUserCoordinate(this.lastCoordinate_, projection);
			const deltaX = newViewCoordinate[0] - lastViewCoordinate[0];
			const deltaY = newViewCoordinate[1] - lastViewCoordinate[1];
			const features = this.features_ || new Collection([this.lastFeature_]);
			const userProjection = getUserProjection();
			features.forEach(function(feature) {
				const geom = feature.getGeometry();
				if (userProjection) {
					geom.transform(userProjection, projection);
					geom.translate(deltaX, deltaY);
					geom.transform(projection, userProjection);
				} else geom.translate(deltaX, deltaY);
				feature.setGeometry(geom);
			});
			this.lastCoordinate_ = newCoordinate;
			this.dispatchEvent(new TranslateEvent(TranslateEventType.TRANSLATING, features, newCoordinate, this.startCoordinate_, event));
		}
	}
	/**
	* Handle pointer move events.
	* @param {import("../MapBrowserEvent.js").default} event Event.
	* @override
	*/
	handleMoveEvent(event) {
		const elem = event.map.getViewport();
		if (this.featuresAtPixel_(event.pixel, event.map)) {
			elem.classList.remove(this.lastCoordinate_ ? "ol-grab" : "ol-grabbing");
			elem.classList.add(this.lastCoordinate_ ? "ol-grabbing" : "ol-grab");
		} else elem.classList.remove("ol-grab", "ol-grabbing");
	}
	/**
	* Tests to see if the given coordinates intersects any of our selected
	* features.
	* @param {import("../pixel.js").Pixel} pixel Pixel coordinate to test for intersection.
	* @param {import("../Map.js").default} map Map to test the intersection on.
	* @return {Feature} Returns the feature found at the specified pixel
	* coordinates.
	* @private
	*/
	featuresAtPixel_(pixel, map) {
		return map.forEachFeatureAtPixel(pixel, (feature, layer) => {
			if (!(feature instanceof Feature) || !this.filter_(feature, layer)) return;
			if (this.features_ && !this.features_.getArray().includes(feature)) return;
			return feature;
		}, {
			layerFilter: this.layerFilter_,
			hitTolerance: this.hitTolerance_
		});
	}
	/**
	* Returns the Hit-detection tolerance.
	* @return {number} Hit tolerance in pixels.
	* @api
	*/
	getHitTolerance() {
		return this.hitTolerance_;
	}
	/**
	* Hit-detection tolerance. Pixels inside the radius around the given position
	* will be checked for features.
	* @param {number} hitTolerance Hit tolerance in pixels.
	* @api
	*/
	setHitTolerance(hitTolerance) {
		this.hitTolerance_ = hitTolerance;
	}
	/**
	* Remove the interaction from its current map and attach it to the new map.
	* Subclasses may set up event handlers to get notified about changes to
	* the map here.
	* @param {import("../Map.js").default} map Map.
	* @override
	*/
	setMap(map) {
		const oldMap = this.getMap();
		super.setMap(map);
		this.updateState_(oldMap);
	}
	/**
	* @private
	*/
	handleActiveChanged_() {
		this.updateState_(null);
	}
	/**
	* @param {import("../Map.js").default} oldMap Old map.
	* @private
	*/
	updateState_(oldMap) {
		let map = this.getMap();
		const active = this.getActive();
		if (!map || !active) {
			map = map || oldMap;
			if (map) map.getViewport().classList.remove("ol-grab", "ol-grabbing");
		}
	}
};
//#endregion
//#region node_modules/ol/interaction/Modify.js
/**
* @module ol/interaction/Modify
*/
/**
* The segment index assigned to a circle's center when
* breaking up a circle into ModifySegmentDataType segments.
* @type {number}
*/
var CIRCLE_CENTER_INDEX = 0;
/**
* The segment index assigned to a circle's circumference when
* breaking up a circle into ModifySegmentDataType segments.
* @type {number}
*/
var CIRCLE_CIRCUMFERENCE_INDEX = 1;
var tempExtent = [
	0,
	0,
	0,
	0
];
var tempSegment$1 = [];
/**
* @enum {string}
*/
var ModifyEventType = {
	/**
	* Triggered upon feature modification start
	* @event ModifyEvent#modifystart
	* @api
	*/
	MODIFYSTART: "modifystart",
	/**
	* Triggered upon feature modification end
	* @event ModifyEvent#modifyend
	* @api
	*/
	MODIFYEND: "modifyend"
};
/**
* @typedef {Object} SegmentData
* @property {Array<number>} [depth] Depth.
* @property {Feature} feature Feature.
* @property {import("../geom/SimpleGeometry.js").default} geometry Geometry.
* @property {number} [index] Index.
* @property {Array<Array<number>>} segment Segment.
* @property {Array<SegmentData>} [featureSegments] FeatureSegments.
*/
/**
* A function that takes a {@link module:ol/Feature~Feature} and  returns `true` if
* the feature may be modified or `false` otherwise.
* @typedef {function(Feature):boolean} FilterFunction
*/
/**
* @typedef {[SegmentData, number]} DragSegment
*/
/**
* @typedef {Object} Options
* @property {import("../events/condition.js").Condition} [condition] A function that
* takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
* boolean to indicate whether that event will be considered to add or move a
* vertex to the sketch. Default is
* {@link module:ol/events/condition.primaryAction}.
* @property {import("../events/condition.js").Condition} [deleteCondition] A function
* that takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
* boolean to indicate whether that event should be handled. By default,
* {@link module:ol/events/condition.singleClick} with
* {@link module:ol/events/condition.altKeyOnly} results in a vertex deletion.
* This combination is handled by wrapping the two condition checks in a single function:
* ```js
* import { altKeyOnly, singleClick } from 'ol/events/condition.js';
*
* function (event) {
*   return altKeyOnly(event) && singleClick(event)
* }
* ```
* @property {import("../events/condition.js").Condition} [insertVertexCondition] A
* function that takes a {@link module:ol/MapBrowserEvent~MapBrowserEvent} and
* returns a boolean to indicate whether a new vertex should be added to the sketch
* features. Default is {@link module:ol/events/condition.always}.
* @property {number} [pixelTolerance=10] Pixel tolerance for considering the
* pointer close enough to a segment or vertex for editing.
* @property {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike} [style]
* Style used for the modification point or vertex. For linestrings and polygons, this will
* be the affected vertex, for circles a point along the circle, and for points the actual
* point. If not configured, the default edit style is used (see {@link module:ol/style/Style~Style}).
* When using a style function, the point feature passed to the function will have an `existing` property -
* indicating whether there is an existing vertex underneath or not, a `features`
* property - an array whose entries are the features that are being modified, and a `geometries`
* property - an array whose entries are the geometries that are being modified. Both arrays are
* in the same order. The `geometries` are only useful when modifying geometry collections, where
* the geometry will be the particular geometry from the collection that is being modified.
* @property {VectorSource} [source] The vector source with
* features to modify.  If a vector source is not provided, a feature collection
* must be provided with the `features` option.
* @property {boolean|import("../layer/BaseVector.js").default} [hitDetection] When configured, point
* features will be considered for modification based on their visual appearance, instead of being within
* the `pixelTolerance` from the pointer location. When a {@link module:ol/layer/BaseVector~BaseVectorLayer} is
* provided, only the rendered representation of the features on that layer will be considered.
* @property {Collection<Feature>} [features]
* The features the interaction works on.  If a feature collection is not
* provided, a vector source must be provided with the `source` option.
* @property {FilterFunction} [filter] A function that takes a {@link module:ol/Feature~Feature}
* and returns `true` if the feature may be modified or `false` otherwise.
* @property {boolean|import("../events/condition.js").Condition} [trace=false] Trace a portion of another geometry.
* Tracing starts when two neighboring vertices are dragged onto a trace target, without any other modification in between..
* @property {VectorSource} [traceSource] Source for features to trace.  If tracing is active and a `traceSource` is
* not provided, the interaction's `source` will be used.  Tracing requires that the interaction is configured with
* either a `traceSource` or a `source`.
* @property {boolean} [wrapX=false] Wrap the world horizontally on the sketch
* overlay.
* @property {boolean} [snapToPointer=!hitDetection] The vertex, point or segment being modified snaps to the
* pointer coordinate when clicked within the `pixelTolerance`.
* @property {function(import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): boolean} [sharedVerticesEqual]
* A function that takes two coordinates and returns whether they should be
* considered equal for vertex matching purposes. By default, all coordinate
* dimensions are compared. This is useful when features have mixed coordinate
* dimensions (e.g., XY and XYZ) but should still be treated as sharing vertices
* at the same 2D position.
*/
function getCoordinatesArray(coordinates, geometryType, depth) {
	let coordinatesArray;
	switch (geometryType) {
		case "LineString":
			coordinatesArray = coordinates;
			break;
		case "MultiLineString":
		case "Polygon":
			coordinatesArray = coordinates[depth[0]];
			break;
		case "MultiPolygon":
			coordinatesArray = coordinates[depth[1]][depth[0]];
			break;
		default:
	}
	return coordinatesArray;
}
/**
* @classdesc
* Events emitted by {@link module:ol/interaction/Modify~Modify} instances are
* instances of this type.
*/
var ModifyEvent = class extends BaseEvent {
	/**
	* @param {ModifyEventType} type Type.
	* @param {Collection<Feature>} features
	* The features modified.
	* @param {import("../MapBrowserEvent.js").default} mapBrowserEvent
	* Associated {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
	*/
	constructor(type, features, mapBrowserEvent) {
		super(type);
		/**
		* The features being modified.
		* @type {Collection<Feature>}
		* @api
		*/
		this.features = features;
		/**
		* Associated {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
		* @type {import("../MapBrowserEvent.js").default}
		* @api
		*/
		this.mapBrowserEvent = mapBrowserEvent;
	}
};
/***
* @template Return
* @typedef {import("../Observable.js").OnSignature<import("../Observable.js").EventTypes, import("../events/Event.js").default, Return> &
*   import("../Observable.js").OnSignature<import("../ObjectEventType.js").Types|
*     'change:active', import("../Object.js").ObjectEvent, Return> &
*   import("../Observable.js").OnSignature<'modifyend'|'modifystart', ModifyEvent, Return> &
*   import("../Observable.js").CombinedOnSignature<import("../Observable.js").EventTypes|import("../ObjectEventType.js").Types|
*     'change:active'|'modifyend'|'modifystart', Return>} ModifyOnSignature
*/
/**
* @classdesc
* Interaction for modifying feature geometries.  To modify features that have
* been added to an existing source, construct the modify interaction with the
* `source` option.  If you want to modify features in a collection (for example,
* the collection used by a select interaction), construct the interaction with
* the `features` option.  The interaction must be constructed with either a
* `source` or `features` option.
*
* Cartesian distance from the pointer is used to determine the features that
* will be modified. This means that geometries will only be considered for
* modification when they are within the configured `pixelTolerance`. For point
* geometries, the `hitDetection` option can be used to match their visual
* appearance.
*
* By default, the interaction will allow deletion of vertices when the `alt`
* key is pressed.  To configure the interaction with a different condition
* for deletion, use the `deleteCondition` option.
* @fires ModifyEvent
* @api
*/
var Modify = class extends PointerInteraction {
	/**
	* @param {Options} options Options.
	*/
	constructor(options) {
		super(options);
		/** @private */
		this.handleSourceAdd_ = this.handleSourceAdd_.bind(this);
		/** @private */
		this.handleSourceRemove_ = this.handleSourceRemove_.bind(this);
		/** @private */
		this.handleExternalCollectionAdd_ = this.handleExternalCollectionAdd_.bind(this);
		/** @private */
		this.handleExternalCollectionRemove_ = this.handleExternalCollectionRemove_.bind(this);
		/** @private */
		this.handleFeatureChange_ = this.handleFeatureChange_.bind(this);
		/***
		* @type {ModifyOnSignature<import("../events.js").EventsKey>}
		*/
		this.on;
		/***
		* @type {ModifyOnSignature<import("../events.js").EventsKey>}
		*/
		this.once;
		/***
		* @type {ModifyOnSignature<void>}
		*/
		this.un;
		/**
		* @private
		* @type {import("../events/condition.js").Condition}
		*/
		this.condition_ = options.condition ? options.condition : primaryAction;
		/**
		* @private
		* @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Browser event.
		* @return {boolean} Combined condition result.
		*/
		this.defaultDeleteCondition_ = function(mapBrowserEvent) {
			return altKeyOnly(mapBrowserEvent) && singleClick(mapBrowserEvent);
		};
		/**
		* @type {import("../events/condition.js").Condition}
		* @private
		*/
		this.deleteCondition_ = options.deleteCondition ? options.deleteCondition : this.defaultDeleteCondition_;
		/**
		* @type {import("../events/condition.js").Condition}
		* @private
		*/
		this.insertVertexCondition_ = options.insertVertexCondition ? options.insertVertexCondition : always;
		/**
		* Editing vertex.
		* @type {Feature<Point>}
		* @private
		*/
		this.vertexFeature_ = null;
		/**
		* Segments intersecting {@link this.vertexFeature_} by segment uid.
		* @type {Object<string, boolean>}
		* @private
		*/
		this.vertexSegments_ = null;
		/**
		* @type {import("../coordinate.js").Coordinate}
		* @private
		*/
		this.lastCoordinate_ = [0, 0];
		/**
		* Tracks if the next `singleclick` event should be ignored to prevent
		* accidental deletion right after vertex creation.
		* @type {boolean}
		* @private
		*/
		this.ignoreNextSingleClick_ = false;
		/**
		* @type {Collection<Feature>}
		* @private
		*/
		this.featuresBeingModified_ = null;
		/**
		* Segment RTree for each layer
		* @type {RBush<SegmentData>}
		* @private
		*/
		this.rBush_ = new RBush();
		/**
		* @type {number}
		* @private
		*/
		this.pixelTolerance_ = options.pixelTolerance !== void 0 ? options.pixelTolerance : 10;
		/**
		* @type {boolean}
		* @private
		*/
		this.snappedToVertex_ = false;
		/**
		* Indicate whether the interaction is currently changing a feature's
		* coordinates.
		* @type {boolean}
		* @private
		*/
		this.changingFeature_ = false;
		/**
		* @type {Array<DragSegment>}
		* @private
		*/
		this.dragSegments_ = [];
		/**
		* Draw overlay where sketch features are drawn.
		* @type {VectorLayer}
		* @private
		*/
		this.overlay_ = new VectorLayer({
			source: new VectorSource({
				useSpatialIndex: false,
				wrapX: !!options.wrapX
			}),
			style: options.style ? options.style : getDefaultStyleFunction(),
			updateWhileAnimating: true,
			updateWhileInteracting: true
		});
		/**
		* @const
		* @private
		* @type {!Object<string, function(Feature, import("../geom/Geometry.js").default): void>}
		*/
		this.SEGMENT_WRITERS_ = {
			Point: this.writePointGeometry_.bind(this),
			LineString: this.writeLineStringGeometry_.bind(this),
			LinearRing: this.writeLineStringGeometry_.bind(this),
			Polygon: this.writePolygonGeometry_.bind(this),
			MultiPoint: this.writeMultiPointGeometry_.bind(this),
			MultiLineString: this.writeMultiLineStringGeometry_.bind(this),
			MultiPolygon: this.writeMultiPolygonGeometry_.bind(this),
			Circle: this.writeCircleGeometry_.bind(this),
			GeometryCollection: this.writeGeometryCollectionGeometry_.bind(this)
		};
		/**
		* @type {VectorSource}
		* @private
		*/
		this.source_ = null;
		/**
		* @type {VectorSource|null}
		* @private
		*/
		this.traceSource_ = options.traceSource || options.source || null;
		/**
		* @type {import("../events/condition.js").Condition}
		* @private
		*/
		this.traceCondition_;
		this.setTrace(options.trace || false);
		/**
		* @type {import('./tracing.js').TraceState}
		* @private
		*/
		this.traceState_ = { active: false };
		/**
		* @type {Array<DragSegment>|null}
		* @private
		*/
		this.traceSegments_ = null;
		/**
		* @type {boolean|import("../layer/BaseVector.js").default}
		* @private
		*/
		this.hitDetection_ = null;
		/**
		* Useful for performance optimization
		* @private
		* @type boolean
		*/
		this.filterFunctionWasSupplied_ = options.filter != void 0 ? true : false;
		/**
		* @private
		* @type {FilterFunction}
		*/
		this.filter_ = options.filter ? options.filter : () => true;
		/**
		* @private
		* @type {function(import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): boolean}
		*/
		this.coordinatesEqual_ = options.sharedVerticesEqual ? options.sharedVerticesEqual : equals;
		if (!(options.features || options.source)) throw new Error("The modify interaction requires features collection or a source");
		/** @type {Array<Feature>} */
		let features;
		if (options.features) {
			features = options.features.getArray();
			options.features.addEventListener(CollectionEventType_default.ADD, this.handleExternalCollectionAdd_);
			options.features.addEventListener(CollectionEventType_default.REMOVE, this.handleExternalCollectionRemove_);
			this.featuresCollection_ = options.features;
		} else if (options.source) {
			features = options.source.getFeatures();
			options.source.addEventListener(VectorEventType_default.ADDFEATURE, this.handleSourceAdd_);
			options.source.addEventListener(VectorEventType_default.REMOVEFEATURE, this.handleSourceRemove_);
			this.source_ = options.source;
		}
		features.forEach((feature) => {
			feature.addEventListener(EventType_default.CHANGE, this.handleFeatureChange_);
			if (this.filterFunctionWasSupplied_) feature.addEventListener(ObjectEventType_default.PROPERTYCHANGE, this.handleFeatureChange_);
		});
		if (options.hitDetection) this.hitDetection_ = options.hitDetection;
		/**
		* Internal features array.  When adding or removing features, be sure to use
		* addFeature_()/removeFeature_() so that the the segment index is adjusted.
		* @type {Array<Feature>}
		* @private
		*/
		this.features_ = [];
		features.filter(this.filter_).forEach((feature) => this.addFeature_(feature));
		/**
		* @type {import("../MapBrowserEvent.js").default}
		* @private
		*/
		this.lastPointerEvent_ = null;
		/**
		* Delta (x, y in map units) between matched rtree vertex and pointer vertex.
		* @type {Array<number>}
		* @private
		*/
		this.delta_ = [0, 0];
		/**
		* @private
		*/
		this.snapToPointer_ = options.snapToPointer === void 0 ? !this.hitDetection_ : options.snapToPointer;
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
	* Called when a feature is added to the internal features collection
	* @param {Feature} feature Feature.
	* @private
	*/
	addFeature_(feature) {
		this.features_.push(feature);
		const geometry = feature.getGeometry();
		if (geometry) {
			const writer = this.SEGMENT_WRITERS_[geometry.getType()];
			if (writer) writer(feature, geometry);
		}
		const map = this.getMap();
		if (map && map.isRendered() && this.getActive()) this.handlePointerAtPixel_(this.lastCoordinate_);
	}
	/**
	* @param {import("../MapBrowserEvent.js").default} evt Map browser event.
	* @param {Array<SegmentData>} segments The segments subject to modification.
	* @private
	*/
	willModifyFeatures_(evt, segments) {
		if (!this.featuresBeingModified_) {
			this.featuresBeingModified_ = new Collection();
			const features = this.featuresBeingModified_.getArray();
			for (let i = 0, ii = segments.length; i < ii; ++i) {
				const feature = segments[i].feature;
				if (feature && !features.includes(feature)) this.featuresBeingModified_.push(feature);
			}
			if (this.featuresBeingModified_.getLength() === 0) this.featuresBeingModified_ = null;
			else this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYSTART, this.featuresBeingModified_, evt));
		}
	}
	/**
	* Removes a feature from the internal features collection and updates internal state
	* accordingly.
	* @param {Feature} feature Feature.
	* @private
	*/
	removeFeature_(feature) {
		const itemIndex = this.features_.indexOf(feature);
		this.features_.splice(itemIndex, 1);
		this.removeFeatureSegmentData_(feature);
		if (this.vertexFeature_ && this.features_.length === 0) {
			this.overlay_.getSource().removeFeature(this.vertexFeature_);
			this.vertexFeature_ = null;
		}
	}
	/**
	* @param {Feature} feature Feature.
	* @private
	*/
	removeFeatureSegmentData_(feature) {
		const rBush = this.rBush_;
		/** @type {Array<SegmentData>} */
		const nodesToRemove = [];
		rBush.forEach(
			/**
			* @param {SegmentData} node RTree node.
			*/
			function(node) {
				if (feature === node.feature) nodesToRemove.push(node);
			}
		);
		for (let i = nodesToRemove.length - 1; i >= 0; --i) {
			const nodeToRemove = nodesToRemove[i];
			for (let j = this.dragSegments_.length - 1; j >= 0; --j) if (this.dragSegments_[j][0] === nodeToRemove) this.dragSegments_.splice(j, 1);
			rBush.remove(nodeToRemove);
		}
	}
	/**
	* Activate or deactivate the interaction.
	* @param {boolean} active Active.
	* @observable
	* @api
	* @override
	*/
	setActive(active) {
		if (this.vertexFeature_ && !active) {
			this.overlay_.getSource().removeFeature(this.vertexFeature_);
			this.vertexFeature_ = null;
		}
		super.setActive(active);
	}
	/**
	* Remove the interaction from its current map and attach it to the new map.
	* Subclasses may set up event handlers to get notified about changes to
	* the map here.
	* @param {import("../Map.js").default} map Map.
	* @override
	*/
	setMap(map) {
		this.overlay_.setMap(map);
		super.setMap(map);
	}
	/**
	* Get the overlay layer that this interaction renders the modification point or vertex to.
	* @return {VectorLayer} Overlay layer.
	* @api
	*/
	getOverlay() {
		return this.overlay_;
	}
	/**
	* @param {import("../source/Vector.js").VectorSourceEvent} event Event.
	* @private
	*/
	handleSourceAdd_(event) {
		const feature = event.feature;
		if (feature) this.externalAddFeatureHandler_(feature);
	}
	/**
	* @param {import("../source/Vector.js").VectorSourceEvent} event Event.
	* @private
	*/
	handleSourceRemove_(event) {
		const feature = event.feature;
		if (feature) this.externalRemoveFeatureHandler_(feature);
	}
	/**
	* @param {import("../Collection.js").CollectionEvent} event Event.
	* @private
	*/
	handleExternalCollectionAdd_(event) {
		const feature = event.element;
		if (feature) this.externalAddFeatureHandler_(feature);
	}
	/**
	* @param {import("../Collection.js").CollectionEvent} event Event.
	* @private
	*/
	handleExternalCollectionRemove_(event) {
		const feature = event.element;
		if (feature) this.externalRemoveFeatureHandler_(feature);
	}
	/**
	* Common handler for event signaling addition of feature to the supplied features source
	* or collection.
	* @param {Feature} feature Feature.
	*/
	externalAddFeatureHandler_(feature) {
		feature.addEventListener(EventType_default.CHANGE, this.handleFeatureChange_);
		if (this.filterFunctionWasSupplied_) feature.addEventListener(ObjectEventType_default.PROPERTYCHANGE, this.handleFeatureChange_);
		if (this.filter_(feature)) this.addFeature_(feature);
	}
	/**
	* Common handler for event signaling removal of feature from the supplied features source
	* or collection.
	* @param {Feature} feature Feature.
	*/
	externalRemoveFeatureHandler_(feature) {
		feature.removeEventListener(EventType_default.CHANGE, this.handleFeatureChange_);
		if (this.filterFunctionWasSupplied_) feature.removeEventListener(ObjectEventType_default.PROPERTYCHANGE, this.handleFeatureChange_);
		this.removeFeature_(feature);
	}
	/**
	* Listener for features in external source or features collection.  Ensures the feature filter
	* is re-run and segment data is updated.
	* @param {import("../events/Event.js").default | import("../Object.js").ObjectEvent} evt Event.
	* @private
	*/
	handleFeatureChange_(evt) {
		if (!this.changingFeature_) {
			const feature = evt.target;
			this.removeFeature_(feature);
			this.filter_(feature) && this.addFeature_(feature);
		}
	}
	/**
	* @param {Feature} feature Feature
	* @param {Point} geometry Geometry.
	* @private
	*/
	writePointGeometry_(feature, geometry) {
		const coordinates = geometry.getCoordinates();
		/** @type {SegmentData} */
		const segmentData = {
			feature,
			geometry,
			segment: [coordinates, coordinates]
		};
		this.rBush_.insert(geometry.getExtent(), segmentData);
	}
	/**
	* @param {Feature} feature Feature
	* @param {import("../geom/MultiPoint.js").default} geometry Geometry.
	* @private
	*/
	writeMultiPointGeometry_(feature, geometry) {
		const points = geometry.getCoordinates();
		for (let i = 0, ii = points.length; i < ii; ++i) {
			const coordinates = points[i];
			/** @type {SegmentData} */
			const segmentData = {
				feature,
				geometry,
				depth: [i],
				index: i,
				segment: [coordinates, coordinates]
			};
			this.rBush_.insert(geometry.getExtent(), segmentData);
		}
	}
	/**
	* @param {Feature} feature Feature
	* @param {import("../geom/LineString.js").default} geometry Geometry.
	* @private
	*/
	writeLineStringGeometry_(feature, geometry) {
		const coordinates = geometry.getCoordinates();
		for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
			const segment = coordinates.slice(i, i + 2);
			/** @type {SegmentData} */
			const segmentData = {
				feature,
				geometry,
				index: i,
				segment
			};
			this.rBush_.insert(boundingExtent(segment), segmentData);
		}
	}
	/**
	* @param {Feature} feature Feature
	* @param {import("../geom/MultiLineString.js").default} geometry Geometry.
	* @private
	*/
	writeMultiLineStringGeometry_(feature, geometry) {
		const lines = geometry.getCoordinates();
		for (let j = 0, jj = lines.length; j < jj; ++j) {
			const coordinates = lines[j];
			for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				const segment = coordinates.slice(i, i + 2);
				/** @type {SegmentData} */
				const segmentData = {
					feature,
					geometry,
					depth: [j],
					index: i,
					segment
				};
				this.rBush_.insert(boundingExtent(segment), segmentData);
			}
		}
	}
	/**
	* @param {Feature} feature Feature
	* @param {import("../geom/Polygon.js").default} geometry Geometry.
	* @private
	*/
	writePolygonGeometry_(feature, geometry) {
		const rings = geometry.getCoordinates();
		for (let j = 0, jj = rings.length; j < jj; ++j) {
			const coordinates = rings[j];
			for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
				const segment = coordinates.slice(i, i + 2);
				/** @type {SegmentData} */
				const segmentData = {
					feature,
					geometry,
					depth: [j],
					index: i,
					segment
				};
				this.rBush_.insert(boundingExtent(segment), segmentData);
			}
		}
	}
	/**
	* @param {Feature} feature Feature
	* @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
	* @private
	*/
	writeMultiPolygonGeometry_(feature, geometry) {
		const polygons = geometry.getCoordinates();
		for (let k = 0, kk = polygons.length; k < kk; ++k) {
			const rings = polygons[k];
			for (let j = 0, jj = rings.length; j < jj; ++j) {
				const coordinates = rings[j];
				for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
					const segment = coordinates.slice(i, i + 2);
					/** @type {SegmentData} */
					const segmentData = {
						feature,
						geometry,
						depth: [j, k],
						index: i,
						segment
					};
					this.rBush_.insert(boundingExtent(segment), segmentData);
				}
			}
		}
	}
	/**
	* We convert a circle into two segments.  The segment at index
	* {@link CIRCLE_CENTER_INDEX} is the
	* circle's center (a point).  The segment at index
	* {@link CIRCLE_CIRCUMFERENCE_INDEX} is
	* the circumference, and is not a line segment.
	*
	* @param {Feature} feature Feature.
	* @param {import("../geom/Circle.js").default} geometry Geometry.
	* @private
	*/
	writeCircleGeometry_(feature, geometry) {
		const coordinates = geometry.getCenter();
		/** @type {SegmentData} */
		const centerSegmentData = {
			feature,
			geometry,
			index: CIRCLE_CENTER_INDEX,
			segment: [coordinates, coordinates]
		};
		/** @type {SegmentData} */
		const circumferenceSegmentData = {
			feature,
			geometry,
			index: CIRCLE_CIRCUMFERENCE_INDEX,
			segment: [coordinates, coordinates]
		};
		const featureSegments = [centerSegmentData, circumferenceSegmentData];
		centerSegmentData.featureSegments = featureSegments;
		circumferenceSegmentData.featureSegments = featureSegments;
		this.rBush_.insert(createOrUpdateFromCoordinate(coordinates), centerSegmentData);
		let circleGeometry = geometry;
		const userProjection = getUserProjection();
		if (userProjection && this.getMap()) {
			const projection = this.getMap().getView().getProjection();
			circleGeometry = circleGeometry.clone().transform(userProjection, projection);
			circleGeometry = fromCircle(circleGeometry).transform(projection, userProjection);
		}
		this.rBush_.insert(circleGeometry.getExtent(), circumferenceSegmentData);
	}
	/**
	* @param {Feature} feature Feature
	* @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
	* @private
	*/
	writeGeometryCollectionGeometry_(feature, geometry) {
		const geometries = geometry.getGeometriesArray();
		for (let i = 0; i < geometries.length; ++i) {
			const geometry = geometries[i];
			const writer = this.SEGMENT_WRITERS_[geometry.getType()];
			writer(feature, geometry);
		}
	}
	/**
	* @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
	* @param {Array<Feature>} features The features being modified.
	* @param {Array<import("../geom/SimpleGeometry.js").default>} geometries The geometries being modified.
	* @param {boolean} existing The vertex represents an existing vertex.
	* @return {Feature} Vertex feature.
	* @private
	*/
	createOrUpdateVertexFeature_(coordinates, features, geometries, existing) {
		let vertexFeature = this.vertexFeature_;
		if (!vertexFeature) {
			vertexFeature = new Feature(new Point(coordinates));
			this.vertexFeature_ = vertexFeature;
			this.overlay_.getSource().addFeature(vertexFeature);
		} else vertexFeature.getGeometry().setCoordinates(coordinates);
		vertexFeature.set("features", features);
		vertexFeature.set("geometries", geometries);
		vertexFeature.set("existing", existing);
		return vertexFeature;
	}
	/**
	* Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may modify the geometry.
	* @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
	* @return {boolean} `false` to stop event propagation.
	* @override
	*/
	handleEvent(mapBrowserEvent) {
		if (!mapBrowserEvent.originalEvent) return true;
		this.lastPointerEvent_ = mapBrowserEvent;
		let handled;
		if (!mapBrowserEvent.map.getView().getInteracting() && mapBrowserEvent.type == MapBrowserEventType_default.POINTERMOVE && !this.handlingDownUpSequence) this.handlePointerMove_(mapBrowserEvent);
		if (this.vertexFeature_ && this.deleteCondition_(mapBrowserEvent)) if (mapBrowserEvent.type != MapBrowserEventType_default.SINGLECLICK || !this.ignoreNextSingleClick_) handled = this.removePoint();
		else handled = true;
		if (mapBrowserEvent.type == MapBrowserEventType_default.SINGLECLICK) this.ignoreNextSingleClick_ = false;
		return super.handleEvent(mapBrowserEvent) && !handled;
	}
	/**
	* @param {import("../coordinate.js").Coordinate} pixelCoordinate Pixel coordinate.
	* @return {Array<SegmentData>|undefined} Insert vertices and update drag segments.
	* @private
	*/
	findInsertVerticesAndUpdateDragSegments_(pixelCoordinate) {
		this.handlePointerAtPixel_(pixelCoordinate);
		this.dragSegments_.length = 0;
		this.featuresBeingModified_ = null;
		if (!this.vertexFeature_) return;
		const projection = this.getMap().getView().getProjection();
		/** @type {Array<SegmentData>} */
		const insertVertices = [];
		const vertex = this.vertexFeature_.getGeometry().getCoordinates();
		const vertexExtent = boundingExtent([vertex]);
		const segmentDataMatches = this.rBush_.getInExtent(vertexExtent);
		const componentSegments = {};
		segmentDataMatches.sort(compareIndexes);
		for (let i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
			const segmentDataMatch = segmentDataMatches[i];
			const segment = segmentDataMatch.segment;
			let uid = getUid(segmentDataMatch.geometry);
			const depth = segmentDataMatch.depth;
			if (depth) uid += "-" + depth.join("-");
			if (!componentSegments[uid]) componentSegments[uid] = new Array(2);
			if (segmentDataMatch.geometry.getType() === "Circle" && segmentDataMatch.index === CIRCLE_CIRCUMFERENCE_INDEX) {
				const closestVertex = closestOnSegmentData(pixelCoordinate, segmentDataMatch, projection);
				if (this.coordinatesEqual_(closestVertex, vertex) && !componentSegments[uid][0]) {
					this.dragSegments_.push([segmentDataMatch, 0]);
					componentSegments[uid][0] = segmentDataMatch;
				}
				continue;
			}
			if (this.coordinatesEqual_(segment[0], vertex) && !componentSegments[uid][0]) {
				this.dragSegments_.push([segmentDataMatch, 0]);
				componentSegments[uid][0] = segmentDataMatch;
				continue;
			}
			if (this.coordinatesEqual_(segment[1], vertex) && !componentSegments[uid][1]) {
				if (componentSegments[uid][0] && componentSegments[uid][0].index === 0) {
					let coordinates = segmentDataMatch.geometry.getCoordinates();
					switch (segmentDataMatch.geometry.getType()) {
						case "LineString":
						case "MultiLineString": continue;
						case "MultiPolygon": coordinates = coordinates[depth[1]];
						case "Polygon":
							if (segmentDataMatch.index !== coordinates[depth[0]].length - 2) continue;
							break;
						default:
					}
				}
				this.dragSegments_.push([segmentDataMatch, 1]);
				componentSegments[uid][1] = segmentDataMatch;
				continue;
			}
			if (getUid(segment) in this.vertexSegments_ && !componentSegments[uid][0] && !componentSegments[uid][1]) insertVertices.push(segmentDataMatch);
		}
		return insertVertices;
	}
	/**
	* @private
	*/
	deactivateTrace_() {
		this.traceState_ = { active: false };
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
			if (distance(event.map.getPixelFromCoordinate(traceState.startCoord), event.pixel) < this.pixelTolerance_) return;
		}
		const updatedTraceTarget = getTraceTargetUpdate(event.coordinate, traceState, event.map, this.pixelTolerance_);
		if (traceState.targetIndex === -1 && Math.sqrt(updatedTraceTarget.closestTargetDistance) / event.map.getView().getResolution() > this.pixelTolerance_) return;
		if (traceState.targetIndex !== updatedTraceTarget.index) {
			if (traceState.targetIndex !== -1) {
				const oldTarget = traceState.targets[traceState.targetIndex];
				this.removeTracedCoordinates_(oldTarget.startIndex, oldTarget.endIndex);
			} else for (const traceSegment of this.traceSegments_) {
				const segmentData = traceSegment[0];
				const geometry = segmentData.geometry;
				const index = traceSegment[1];
				const coordinates = geometry.getCoordinates();
				getCoordinatesArray(coordinates, geometry.getType(), segmentData.depth).splice(segmentData.index + index, 1);
				geometry.setCoordinates(coordinates);
				if (index === 0) segmentData.index -= 1;
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
	}
	getTraceCandidates_(event) {
		const map = this.getMap();
		const tolerance = this.pixelTolerance_;
		const extent = boundingExtent([map.getCoordinateFromPixel([event.pixel[0] - tolerance, event.pixel[1] + tolerance]), map.getCoordinateFromPixel([event.pixel[0] + tolerance, event.pixel[1] - tolerance])]);
		return this.traceSource_.getFeaturesInExtent(extent);
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
			this.traceSegments_ = null;
			return;
		}
		const features = this.getTraceCandidates_(event);
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
	* @param {import('./tracing.js').TraceTarget} target The trace target.
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
		if (remove > 0) for (const traceSegment of this.traceSegments_) {
			const segmentData = traceSegment[0];
			const geometry = segmentData.geometry;
			const index = traceSegment[1];
			let removeIndex = traceSegment[0].index + 1;
			if (index === 1) removeIndex -= remove;
			const coordinates = geometry.getCoordinates();
			getCoordinatesArray(coordinates, geometry.getType(), segmentData.depth).splice(removeIndex, remove);
			geometry.setCoordinates(coordinates);
			if (index === 1) segmentData.index -= remove;
		}
	}
	/**
	* @param {import('./tracing.js').TraceTarget} target The trace target.
	* @param {number} fromIndex The start index.
	* @param {number} toIndex The end index.
	* @private
	*/
	addTracedCoordinates_(target, fromIndex, toIndex) {
		if (fromIndex === toIndex) return;
		const newCoordinates = [];
		if (fromIndex < toIndex) {
			const start = Math.ceil(fromIndex);
			let end = Math.floor(toIndex);
			if (end === toIndex) end -= 1;
			for (let i = start; i <= end; ++i) newCoordinates.push(getCoordinate(target.coordinates, i));
		} else {
			const start = Math.floor(fromIndex);
			let end = Math.ceil(toIndex);
			if (end === toIndex) end += 1;
			for (let i = start; i >= end; --i) newCoordinates.push(getCoordinate(target.coordinates, i));
		}
		if (newCoordinates.length) for (const traceSegment of this.traceSegments_) {
			const segmentData = traceSegment[0];
			const geometry = segmentData.geometry;
			const index = traceSegment[1];
			const insertIndex = segmentData.index + 1;
			if (index === 0) newCoordinates.reverse();
			const coordinates = geometry.getCoordinates();
			getCoordinatesArray(coordinates, geometry.getType(), segmentData.depth).splice(insertIndex, 0, ...newCoordinates);
			geometry.setCoordinates(coordinates);
			if (index === 1) segmentData.index += newCoordinates.length;
		}
	}
	/**
	* @param {import('../coordinate.js').Coordinate} vertex Vertex.
	* @param {DragSegment} dragSegment Drag segment.
	*/
	updateGeometry_(vertex, dragSegment) {
		const segmentData = dragSegment[0];
		const depth = segmentData.depth;
		let coordinates;
		const segment = segmentData.segment;
		const geometry = segmentData.geometry;
		const index = dragSegment[1];
		const stride = geometry.getStride();
		for (let i = 2; i < stride; ++i) vertex[i] = segment[index][i];
		vertex.length = stride;
		switch (geometry.getType()) {
			case "Point":
				coordinates = vertex;
				segment[0] = vertex;
				segment[1] = vertex;
				break;
			case "MultiPoint":
				coordinates = geometry.getCoordinates();
				coordinates[segmentData.index] = vertex;
				segment[0] = vertex;
				segment[1] = vertex;
				break;
			case "LineString":
				coordinates = geometry.getCoordinates();
				coordinates[segmentData.index + index] = vertex;
				segment[index] = vertex;
				break;
			case "MultiLineString":
				coordinates = geometry.getCoordinates();
				coordinates[depth[0]][segmentData.index + index] = vertex;
				segment[index] = vertex;
				break;
			case "Polygon": {
				coordinates = geometry.getCoordinates();
				const ring = coordinates[depth[0]];
				const targetIndex = segmentData.index + index;
				if (ring[targetIndex][0] === vertex[0] && ring[targetIndex][1] === vertex[1]) coordinates = null;
				else {
					ring[targetIndex] = vertex;
					if (targetIndex === 0) ring[ring.length - 1] = vertex;
					else if (targetIndex === ring.length - 1) ring[0] = vertex;
				}
				segment[index] = vertex;
				break;
			}
			case "MultiPolygon": {
				coordinates = geometry.getCoordinates();
				const mRing = coordinates[depth[1]][depth[0]];
				const mTargetIndex = segmentData.index + index;
				if (mRing[mTargetIndex][0] === vertex[0] && mRing[mTargetIndex][1] === vertex[1]) coordinates = null;
				else {
					mRing[mTargetIndex] = vertex;
					if (mTargetIndex === 0) mRing[mRing.length - 1] = vertex;
					else if (mTargetIndex === mRing.length - 1) mRing[0] = vertex;
				}
				segment[index] = vertex;
				break;
			}
			case "Circle":
				const circle = geometry;
				segment[0] = vertex;
				segment[1] = vertex;
				if (segmentData.index === CIRCLE_CENTER_INDEX) {
					this.changingFeature_ = true;
					circle.setCenter(vertex);
					this.changingFeature_ = false;
				} else {
					this.changingFeature_ = true;
					const projection = this.getMap().getView().getProjection();
					let radius = distance(fromUserCoordinate(circle.getCenter(), projection), fromUserCoordinate(vertex, projection));
					const userProjection = getUserProjection();
					if (userProjection) {
						const circleGeometry = circle.clone().transform(userProjection, projection);
						circleGeometry.setRadius(radius);
						radius = circleGeometry.transform(projection, userProjection).getRadius();
					}
					circle.setRadius(radius);
					this.changingFeature_ = false;
				}
				break;
			default:
		}
		if (coordinates) this.setGeometryCoordinates_(geometry, coordinates);
	}
	/**
	* Handle pointer drag events.
	* @param {import("../MapBrowserEvent.js").default} evt Event.
	* @override
	*/
	handleDragEvent(evt) {
		this.ignoreNextSingleClick_ = false;
		this.willModifyFeatures_(evt, this.dragSegments_.map(([segment]) => segment));
		const vertex = [evt.coordinate[0] + this.delta_[0], evt.coordinate[1] + this.delta_[1]];
		const features = [];
		const geometries = [];
		const startTraceCoord = this.traceState_.active && !this.traceSegments_ ? this.traceState_.startCoord : null;
		if (startTraceCoord) {
			this.traceSegments_ = [];
			for (const dragSegment of this.dragSegments_) {
				const segmentData = dragSegment[0];
				if (distance(closestOnSegment(startTraceCoord, segmentData.segment), startTraceCoord) / evt.map.getView().getResolution() < 1) this.traceSegments_.push(dragSegment);
			}
		}
		for (let i = 0, ii = this.dragSegments_.length; i < ii; ++i) {
			const dragSegment = this.dragSegments_[i];
			const segmentData = dragSegment[0];
			const feature = segmentData.feature;
			if (!features.includes(feature)) features.push(feature);
			const geometry = segmentData.geometry;
			if (!geometries.includes(geometry)) geometries.push(geometry);
			this.updateGeometry_(vertex, dragSegment);
		}
		this.updateTrace_(evt);
		this.createOrUpdateVertexFeature_(vertex, features, geometries, true);
	}
	/**
	* Handle pointer down events.
	* @param {import("../MapBrowserEvent.js").default} evt Event.
	* @return {boolean} If the event was consumed.
	* @override
	*/
	handleDownEvent(evt) {
		if (!this.condition_(evt)) return false;
		const pixelCoordinate = evt.coordinate;
		const insertVertices = this.findInsertVerticesAndUpdateDragSegments_(pixelCoordinate);
		if (insertVertices?.length && this.insertVertexCondition_(evt)) {
			this.willModifyFeatures_(evt, insertVertices);
			if (this.vertexFeature_) {
				const vertex = this.vertexFeature_.getGeometry().getCoordinates();
				for (let j = insertVertices.length - 1; j >= 0; --j) this.insertVertex_(insertVertices[j], vertex);
				this.ignoreNextSingleClick_ = true;
			}
		}
		return !!this.vertexFeature_;
	}
	/**
	* Handle pointer up events.
	* @param {import("../MapBrowserEvent.js").default} evt Event.
	* @return {boolean} If the event was consumed.
	* @override
	*/
	handleUpEvent(evt) {
		for (let i = this.dragSegments_.length - 1; i >= 0; --i) {
			const segmentData = this.dragSegments_[i][0];
			const geometry = segmentData.geometry;
			if (geometry.getType() === "Circle") {
				const circle = geometry;
				const coordinates = circle.getCenter();
				const centerSegmentData = segmentData.featureSegments[0];
				const circumferenceSegmentData = segmentData.featureSegments[1];
				centerSegmentData.segment[0] = coordinates;
				centerSegmentData.segment[1] = coordinates;
				circumferenceSegmentData.segment[0] = coordinates;
				circumferenceSegmentData.segment[1] = coordinates;
				this.rBush_.update(createOrUpdateFromCoordinate(coordinates), centerSegmentData);
				/** @type {import("../geom/Circle.js").default | import("../geom/Polygon.js").default} */
				let circleGeometry = circle;
				const userProjection = getUserProjection();
				if (userProjection) {
					const projection = evt.map.getView().getProjection();
					circleGeometry = circleGeometry.clone().transform(userProjection, projection);
					circleGeometry = fromCircle(circleGeometry).transform(projection, userProjection);
				}
				this.rBush_.update(circleGeometry.getExtent(), circumferenceSegmentData);
			} else this.rBush_.update(boundingExtent(segmentData.segment), segmentData);
		}
		if (this.featuresBeingModified_) {
			this.toggleTraceState_(evt);
			this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYEND, this.featuresBeingModified_, evt));
			this.featuresBeingModified_ = null;
		}
		return false;
	}
	/**
	* @param {import("../MapBrowserEvent.js").default} evt Event.
	* @private
	*/
	handlePointerMove_(evt) {
		this.lastCoordinate_ = evt.coordinate;
		this.handlePointerAtPixel_(this.lastCoordinate_);
	}
	/**
	* @param {import("../coordinate.js").Coordinate} pixelCoordinate The pixel Coordinate.
	* @private
	*/
	handlePointerAtPixel_(pixelCoordinate) {
		const map = this.getMap();
		const pixel = map.getPixelFromCoordinate(pixelCoordinate);
		const projection = map.getView().getProjection();
		const sortByDistance = function(a, b) {
			return projectedDistanceToSegmentDataSquared(pixelCoordinate, a, projection) - projectedDistanceToSegmentDataSquared(pixelCoordinate, b, projection);
		};
		/** @type {Array<SegmentData>|undefined} */
		let nodes;
		/** @type {Point|undefined} */
		let hitPointGeometry;
		if (this.hitDetection_) {
			const layerFilter = typeof this.hitDetection_ === "object" ? (layer) => layer === this.hitDetection_ : void 0;
			map.forEachFeatureAtPixel(pixel, (feature, layer, geometry) => {
				if (geometry && geometry.getType() === "Point") geometry = new Point(toUserCoordinate(geometry.getCoordinates(), projection));
				const geom = geometry || feature.getGeometry();
				if (geom && geom.getType() === "Point" && feature instanceof Feature && this.features_.includes(feature)) {
					hitPointGeometry = geom;
					const coordinate = feature.getGeometry().getFlatCoordinates().slice(0, 2);
					nodes = [{
						feature,
						geometry: hitPointGeometry,
						segment: [coordinate, coordinate]
					}];
				}
				return true;
			}, { layerFilter });
		}
		if (!nodes) {
			const box = toUserExtent(buffer(fromUserExtent(createOrUpdateFromCoordinate(pixelCoordinate, tempExtent), projection), map.getView().getResolution() * this.pixelTolerance_, tempExtent), projection);
			nodes = this.rBush_.getInExtent(box);
		}
		if (nodes && nodes.length > 0) {
			const node = nodes.sort(sortByDistance)[0];
			const closestSegment = node.segment;
			let vertex = closestOnSegmentData(pixelCoordinate, node, projection);
			const vertexPixel = map.getPixelFromCoordinate(vertex);
			let dist = distance(pixel, vertexPixel);
			if (hitPointGeometry || dist <= this.pixelTolerance_) {
				/** @type {Object<string, boolean>} */
				const vertexSegments = {};
				vertexSegments[getUid(closestSegment)] = true;
				if (!this.snapToPointer_) {
					this.delta_[0] = vertex[0] - pixelCoordinate[0];
					this.delta_[1] = vertex[1] - pixelCoordinate[1];
				}
				if (node.geometry.getType() === "Circle" && node.index === CIRCLE_CIRCUMFERENCE_INDEX) {
					this.snappedToVertex_ = true;
					this.createOrUpdateVertexFeature_(vertex, [node.feature], [node.geometry], this.snappedToVertex_);
				} else {
					const pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
					const pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
					const squaredDist1 = squaredDistance(vertexPixel, pixel1);
					const squaredDist2 = squaredDistance(vertexPixel, pixel2);
					dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
					this.snappedToVertex_ = dist <= this.pixelTolerance_;
					if (!this.snappedToVertex_ && !this.insertVertexCondition_(this.lastPointerEvent_)) {
						if (this.vertexFeature_) {
							this.overlay_.getSource().removeFeature(this.vertexFeature_);
							this.vertexFeature_ = null;
						}
						return;
					}
					if (this.snappedToVertex_) vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
					this.createOrUpdateVertexFeature_(vertex, [node.feature], [node.geometry], this.snappedToVertex_);
					const geometries = {};
					geometries[getUid(node.geometry)] = true;
					for (let i = 1, ii = nodes.length; i < ii; ++i) {
						const segment = nodes[i].segment;
						if (this.coordinatesEqual_(closestSegment[0], segment[0]) && this.coordinatesEqual_(closestSegment[1], segment[1]) || this.coordinatesEqual_(closestSegment[0], segment[1]) && this.coordinatesEqual_(closestSegment[1], segment[0])) {
							const geometryUid = getUid(nodes[i].geometry);
							if (!(geometryUid in geometries)) {
								geometries[geometryUid] = true;
								vertexSegments[getUid(segment)] = true;
							}
						} else break;
					}
				}
				this.vertexSegments_ = vertexSegments;
				return;
			}
		}
		if (this.vertexFeature_) {
			this.overlay_.getSource().removeFeature(this.vertexFeature_);
			this.vertexFeature_ = null;
		}
	}
	/**
	* @param {SegmentData} segmentData Segment data.
	* @param {import("../coordinate.js").Coordinate} vertex Vertex.
	* @return {boolean} A vertex was inserted.
	* @private
	*/
	insertVertex_(segmentData, vertex) {
		const segment = segmentData.segment;
		const feature = segmentData.feature;
		const geometry = segmentData.geometry;
		const depth = segmentData.depth;
		const index = segmentData.index;
		let coordinates;
		while (vertex.length < geometry.getStride()) vertex.push(0);
		switch (geometry.getType()) {
			case "MultiLineString":
				coordinates = geometry.getCoordinates();
				coordinates[depth[0]].splice(index + 1, 0, vertex);
				break;
			case "Polygon":
				coordinates = geometry.getCoordinates();
				coordinates[depth[0]].splice(index + 1, 0, vertex);
				break;
			case "MultiPolygon":
				coordinates = geometry.getCoordinates();
				coordinates[depth[1]][depth[0]].splice(index + 1, 0, vertex);
				break;
			case "LineString":
				coordinates = geometry.getCoordinates();
				coordinates.splice(index + 1, 0, vertex);
				break;
			default: return false;
		}
		this.setGeometryCoordinates_(geometry, coordinates);
		const rTree = this.rBush_;
		rTree.remove(segmentData);
		this.updateSegmentIndices_(geometry, index, depth, 1);
		/** @type {SegmentData} */
		const newSegmentData = {
			segment: [segment[0], vertex],
			feature,
			geometry,
			depth,
			index
		};
		rTree.insert(boundingExtent(newSegmentData.segment), newSegmentData);
		this.dragSegments_.push([newSegmentData, 1]);
		/** @type {SegmentData} */
		const newSegmentData2 = {
			segment: [vertex, segment[1]],
			feature,
			geometry,
			depth,
			index: index + 1
		};
		rTree.insert(boundingExtent(newSegmentData2.segment), newSegmentData2);
		this.dragSegments_.push([newSegmentData2, 0]);
		return true;
	}
	/**
	* @param {import("../coordinate.js").Coordinate} coordinate The coordinate.
	* @return {import("../coordinate.js").Coordinate} The updated pointer coordinate.
	* @private
	*/
	updatePointer_(coordinate) {
		if (coordinate) this.findInsertVerticesAndUpdateDragSegments_(coordinate);
		return this.vertexFeature_?.getGeometry().getCoordinates();
	}
	/**
	* Get the current pointer position.
	* @return {import("../coordinate.js").Coordinate | null} The current pointer coordinate.
	*/
	getPoint() {
		const coordinate = this.vertexFeature_?.getGeometry().getCoordinates();
		if (!coordinate) return null;
		return toUserCoordinate(coordinate, this.getMap().getView().getProjection());
	}
	/**
	* Check if a point can be removed from the current linestring or polygon at the current
	* pointer position.
	* @return {boolean} A point can be deleted at the current pointer position.
	* @api
	*/
	canRemovePoint() {
		if (!this.vertexFeature_) return false;
		if (this.vertexFeature_.get("geometries").every((geometry) => geometry.getType() === "Circle" || geometry.getType().endsWith("Point"))) return false;
		const coordinate = this.vertexFeature_.getGeometry().getCoordinates();
		return this.rBush_.getInExtent(boundingExtent([coordinate])).some(({ segment }) => this.coordinatesEqual_(segment[0], coordinate) || this.coordinatesEqual_(segment[1], coordinate));
	}
	/**
	* Removes the vertex currently being pointed from the current linestring or polygon.
	* @param {import('../coordinate.js').Coordinate} [coordinate] If provided, the pointer
	* will be set to the provided coordinate. If not, the current pointer coordinate will be used.
	* @return {boolean} True when a vertex was removed.
	* @api
	*/
	removePoint(coordinate) {
		if (coordinate) {
			coordinate = fromUserCoordinate(coordinate, this.getMap().getView().getProjection());
			this.updatePointer_(coordinate);
		}
		if (!this.lastPointerEvent_ || this.lastPointerEvent_ && this.lastPointerEvent_.type != MapBrowserEventType_default.POINTERDRAG) {
			const evt = this.lastPointerEvent_;
			this.willModifyFeatures_(evt, this.dragSegments_.map(([segment]) => segment));
			const removed = this.removeVertex_();
			if (this.featuresBeingModified_) this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYEND, this.featuresBeingModified_, evt));
			this.featuresBeingModified_ = null;
			return removed;
		}
		return false;
	}
	/**
	* Removes a vertex from all matching features.
	* @return {boolean} True when a vertex was removed.
	* @private
	*/
	removeVertex_() {
		const dragSegments = this.dragSegments_;
		const segmentsByFeature = {};
		let deleted = false;
		let component, coordinates, dragSegment, geometry, i, index, left;
		let newIndex, right, segmentData, uid;
		for (i = dragSegments.length - 1; i >= 0; --i) {
			dragSegment = dragSegments[i];
			segmentData = dragSegment[0];
			uid = getUid(segmentData.feature);
			if (segmentData.depth) uid += "-" + segmentData.depth.join("-");
			if (!(uid in segmentsByFeature)) segmentsByFeature[uid] = {};
			if (dragSegment[1] === 0) {
				segmentsByFeature[uid].right = segmentData;
				segmentsByFeature[uid].index = segmentData.index;
			} else if (dragSegment[1] == 1) {
				segmentsByFeature[uid].left = segmentData;
				segmentsByFeature[uid].index = segmentData.index + 1;
			}
		}
		for (uid in segmentsByFeature) {
			right = segmentsByFeature[uid].right;
			left = segmentsByFeature[uid].left;
			index = segmentsByFeature[uid].index;
			newIndex = index - 1;
			if (left !== void 0) segmentData = left;
			else segmentData = right;
			if (newIndex < 0) newIndex = 0;
			geometry = segmentData.geometry;
			coordinates = geometry.getCoordinates();
			component = coordinates;
			deleted = false;
			switch (geometry.getType()) {
				case "MultiLineString":
					if (coordinates[segmentData.depth[0]].length > 2) {
						coordinates[segmentData.depth[0]].splice(index, 1);
						deleted = true;
					}
					break;
				case "LineString":
					if (coordinates.length > 2) {
						coordinates.splice(index, 1);
						deleted = true;
					}
					break;
				case "MultiPolygon": component = component[segmentData.depth[1]];
				case "Polygon":
					component = component[segmentData.depth[0]];
					if (component.length > 4) {
						if (index == component.length - 1) index = 0;
						component.splice(index, 1);
						deleted = true;
						if (index === 0) {
							component.pop();
							component.push(component[0]);
							newIndex = component.length - 1;
						}
					}
					break;
				default:
			}
			if (deleted) {
				this.setGeometryCoordinates_(geometry, coordinates);
				const segments = [];
				if (left !== void 0) {
					this.rBush_.remove(left);
					segments.push(left.segment[0]);
				}
				if (right !== void 0) {
					this.rBush_.remove(right);
					segments.push(right.segment[1]);
				}
				if (left !== void 0 && right !== void 0) {
					/** @type {SegmentData} */
					const newSegmentData = {
						depth: segmentData.depth,
						feature: segmentData.feature,
						geometry: segmentData.geometry,
						index: newIndex,
						segment: segments
					};
					this.rBush_.insert(boundingExtent(newSegmentData.segment), newSegmentData);
				}
				this.updateSegmentIndices_(geometry, index, segmentData.depth, -1);
				if (this.vertexFeature_) {
					this.overlay_.getSource().removeFeature(this.vertexFeature_);
					this.vertexFeature_ = null;
				}
				dragSegments.length = 0;
			}
		}
		return deleted;
	}
	/**
	* Check if a point can be inserted to the current linestring or polygon at the current
	* pointer position.
	* @return {boolean} A point can be inserted at the current pointer position.
	* @api
	*/
	canInsertPoint() {
		if (!this.vertexFeature_) return false;
		if (this.vertexFeature_.get("geometries").every((geometry) => geometry.getType() === "Circle" || geometry.getType().endsWith("Point"))) return false;
		const coordinate = this.vertexFeature_.getGeometry().getCoordinates();
		return this.rBush_.getInExtent(boundingExtent([coordinate])).some(({ segment }) => !(this.coordinatesEqual_(segment[0], coordinate) || this.coordinatesEqual_(segment[1], coordinate)));
	}
	/**
	* Inserts the vertex currently being pointed to the current linestring or polygon.
	* @param {import('../coordinate.js').Coordinate} [coordinate] If provided, the pointer
	* will be set to the provided coordinate. If not, the current pointer coordinate will be used.
	* @return {boolean} A vertex was inserted.
	* @api
	*/
	insertPoint(coordinate) {
		const pixelCoordinate = coordinate ? fromUserCoordinate(coordinate, this.getMap().getView().getProjection()) : this.vertexFeature_?.getGeometry().getCoordinates();
		if (!pixelCoordinate) return false;
		return this.findInsertVerticesAndUpdateDragSegments_(pixelCoordinate).reduce((prev, segmentData) => prev || this.insertVertex_(segmentData, pixelCoordinate), false);
	}
	/**
	* @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
	* @param {Array} coordinates Coordinates.
	* @private
	*/
	setGeometryCoordinates_(geometry, coordinates) {
		this.changingFeature_ = true;
		geometry.setCoordinates(coordinates);
		this.changingFeature_ = false;
	}
	/**
	* @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
	* @param {number} index Index.
	* @param {Array<number>|undefined} depth Depth.
	* @param {number} delta Delta (1 or -1).
	* @private
	*/
	updateSegmentIndices_(geometry, index, depth, delta) {
		this.rBush_.forEachInExtent(geometry.getExtent(), function(segmentDataMatch) {
			if (segmentDataMatch.geometry === geometry && (depth === void 0 || segmentDataMatch.depth === void 0 || equals$1(segmentDataMatch.depth, depth)) && segmentDataMatch.index > index) segmentDataMatch.index += delta;
		});
	}
	/**
	* @override
	*/
	disposeInternal() {
		super.disposeInternal();
		if (this.featuresCollection_) {
			this.featuresCollection_.removeEventListener(CollectionEventType_default.ADD, this.handleExternalCollectionAdd_);
			this.featuresCollection_.removeEventListener(CollectionEventType_default.REMOVE, this.handleExternalCollectionRemove_);
			for (const feature of this.featuresCollection_.getArray()) {
				feature.removeEventListener(EventType_default.CHANGE, this.handleFeatureChange_);
				if (this.filterFunctionWasSupplied_) feature.removeEventListener(ObjectEventType_default.PROPERTYCHANGE, this.handleFeatureChange_);
			}
		} else if (this.source_) {
			this.source_.removeEventListener(VectorEventType_default.ADDFEATURE, this.handleSourceAdd_);
			this.source_.removeEventListener(VectorEventType_default.REMOVEFEATURE, this.handleSourceRemove_);
			for (const feature of this.source_.getFeatures()) {
				feature.removeEventListener(EventType_default.CHANGE, this.handleFeatureChange_);
				if (this.filterFunctionWasSupplied_) feature.removeEventListener(ObjectEventType_default.PROPERTYCHANGE, this.handleFeatureChange_);
			}
		}
	}
};
/**
* @param {SegmentData} a The first segment data.
* @param {SegmentData} b The second segment data.
* @return {number} The difference in indexes.
*/
function compareIndexes(a, b) {
	return a.index - b.index;
}
/**
* Returns the distance from a point to a line segment.
*
* @param {import("../coordinate.js").Coordinate} pointCoordinates The coordinates of the point from
*        which to calculate the distance.
* @param {SegmentData} segmentData The object describing the line
*        segment we are calculating the distance to.
* @param {import("../proj/Projection.js").default} projection The view projection.
* @return {number} The square of the distance between a point and a line segment.
*/
function projectedDistanceToSegmentDataSquared(pointCoordinates, segmentData, projection) {
	const geometry = segmentData.geometry;
	if (geometry.getType() === "Circle") {
		let circleGeometry = geometry;
		if (segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
			const userProjection = getUserProjection();
			if (userProjection) circleGeometry = circleGeometry.clone().transform(userProjection, projection);
			const distanceToCenterSquared = squaredDistance(circleGeometry.getCenter(), fromUserCoordinate(pointCoordinates, projection));
			const distanceToCircumference = Math.sqrt(distanceToCenterSquared) - circleGeometry.getRadius();
			return distanceToCircumference * distanceToCircumference;
		}
	}
	const coordinate = fromUserCoordinate(pointCoordinates, projection);
	tempSegment$1[0] = fromUserCoordinate(segmentData.segment[0], projection);
	tempSegment$1[1] = fromUserCoordinate(segmentData.segment[1], projection);
	return squaredDistanceToSegment(coordinate, tempSegment$1);
}
/**
* Returns the point closest to a given line segment.
*
* @param {import("../coordinate.js").Coordinate} pointCoordinates The point to which a closest point
*        should be found.
* @param {SegmentData} segmentData The object describing the line
*        segment which should contain the closest point.
* @param {import("../proj/Projection.js").default} projection The view projection.
* @return {import("../coordinate.js").Coordinate} The point closest to the specified line segment.
*/
function closestOnSegmentData(pointCoordinates, segmentData, projection) {
	const geometry = segmentData.geometry;
	if (geometry.getType() === "Circle" && segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
		let circleGeometry = geometry;
		const userProjection = getUserProjection();
		if (userProjection) circleGeometry = circleGeometry.clone().transform(userProjection, projection);
		return toUserCoordinate(circleGeometry.getClosestPoint(fromUserCoordinate(pointCoordinates, projection)), projection);
	}
	const coordinate = fromUserCoordinate(pointCoordinates, projection);
	tempSegment$1[0] = fromUserCoordinate(segmentData.segment[0], projection);
	tempSegment$1[1] = fromUserCoordinate(segmentData.segment[1], projection);
	return toUserCoordinate(closestOnSegment(coordinate, tempSegment$1), projection);
}
/**
* @return {import("../style/Style.js").StyleFunction} Styles.
*/
function getDefaultStyleFunction() {
	const style = createEditingStyle();
	return function(feature, resolution) {
		return style["Point"];
	};
}
//#endregion
//#region node_modules/ol/events/SnapEvent.js
/**
* @module ol/events/SnapEvent
*/
/**
* @enum {string}
*/
var SnapEventType = {
	/**
	* Triggered upon snapping to vertex or edge
	* @event SnapEvent#snap
	* @api
	*/
	SNAP: "snap",
	/**
	* Triggered if no longer snapped
	* @event SnapEvent#unsnap
	* @api
	*/
	UNSNAP: "unsnap"
};
/**
* @classdesc
* Events emitted by {@link module:ol/interaction/Snap~Snap} instances are instances of this
*/
var SnapEvent = class extends BaseEvent {
	/**
	* @param {SnapEventType} type Type.
	* @param {Object} options Options.
	* @param {import("../coordinate.js").Coordinate} options.vertex The snapped vertex.
	* @param {import("../coordinate.js").Coordinate} options.vertexPixel The pixel of the snapped vertex.
	* @param {import("../Feature.js").default} options.feature The feature being snapped.
	* @param {Array<import("../coordinate.js").Coordinate>|null} options.segment Segment, or `null` if snapped to a vertex.
	*/
	constructor(type, options) {
		super(type);
		/**
		* The Map coordinate of the snapped point.
		* @type {import("../coordinate.js").Coordinate}
		* @api
		*/
		this.vertex = options.vertex;
		/**
		* The Map pixel of the snapped point.
		* @type {Array<number>&Array<number>}
		* @api
		*/
		this.vertexPixel = options.vertexPixel;
		/**
		* The feature closest to the snapped point.
		* @type {import("../Feature.js").default<import("../geom/Geometry.js").default>}
		* @api
		*/
		this.feature = options.feature;
		/**
		* The segment closest to the snapped point, if snapped to a segment.
		* @type {Array<import("../coordinate.js").Coordinate>|null}
		* @api
		*/
		this.segment = options.segment;
	}
};
//#endregion
//#region node_modules/ol/interaction/Snap.js
/**
* @module ol/interaction/Snap
*/
/**
* @typedef {Array<import("../coordinate.js").Coordinate>} Segment
* An array of two coordinates representing a line segment, or an array of one
* coordinate representing a point.
*/
/**
* @typedef {Object} SegmentData
* @property {import("../Feature.js").default} feature Feature.
* @property {import("../Feature.js").default} [intersectionFeature] Feature which intersects.
* @property {Segment} segment Segment.
*/
/**
* @template {import("../geom/Geometry.js").default} [GeometryType=import("../geom/Geometry.js").default]
* @typedef {(geometry: GeometryType, projection?: import("../proj/Projection.js").default) => Array<Segment>} Segmenter
* A function taking a {@link module:ol/geom/Geometry~Geometry} as argument and returning an array of {@link Segment}s.
*/
/**
* Each segmenter specified here will override the default segmenter for the
* corresponding geometry type. To exclude all geometries of a specific geometry type from being snapped to,
* set the segmenter to `null`.
* @typedef {Object} Segmenters
* @property {Segmenter<import("../geom/Point.js").default>|null} [Point] Point segmenter.
* @property {Segmenter<import("../geom/LineString.js").default>|null} [LineString] LineString segmenter.
* @property {Segmenter<import("../geom/Polygon.js").default>|null} [Polygon] Polygon segmenter.
* @property {Segmenter<import("../geom/Circle.js").default>|null} [Circle] Circle segmenter.
* @property {Segmenter<import("../geom/GeometryCollection.js").default>|null} [GeometryCollection] GeometryCollection segmenter.
* @property {Segmenter<import("../geom/MultiPoint.js").default>|null} [MultiPoint] MultiPoint segmenter.
* @property {Segmenter<import("../geom/MultiLineString.js").default>|null} [MultiLineString] MultiLineString segmenter.
* @property {Segmenter<import("../geom/MultiPolygon.js").default>|null} [MultiPolygon] MultiPolygon segmenter.
*/
/**
* @typedef {Object} Options
* @property {import("../Collection.js").default<import("../Feature.js").default>} [features] Snap to these features. Either this option or source should be provided.
* @property {import("../source/Vector.js").default} [source] Snap to features from this source. Either this option or features should be provided
* @property {boolean} [edge=true] Snap to edges.
* @property {boolean} [vertex=true] Snap to vertices.
* @property {boolean} [intersection=false] Snap to intersections between segments.
* @property {number} [pixelTolerance=10] Pixel tolerance for considering the pointer close enough to a segment or
* vertex for snapping.
* @property {Segmenters} [segmenters] Custom segmenters by {@link module:ol/geom/Geometry~Type}. By default, the
* following segmenters are used:
*   - `Point`: A one-dimensional segment (e.g. `[[10, 20]]`) representing the point.
*   - `LineString`: One two-dimensional segment (e.g. `[[10, 20], [30, 40]]`) for each segment of the linestring.
*   - `Polygon`: One two-dimensional segment for each segment of the exterior ring and the interior rings.
*   - `Circle`: One two-dimensional segment for each segment of a regular polygon with 32 points representing the circle circumference.
*   - `GeometryCollection`: All segments of the contained geometries.
*   - `MultiPoint`: One one-dimensional segment for each point.
*   - `MultiLineString`: One two-dimensional segment for each segment of the linestrings.
*   - `MultiPolygon`: One two-dimensional segment for each segment of the polygons.
*/
/**
* Information about the last snapped state.
* @typedef {Object} SnappedInfo
* @property {import("../coordinate.js").Coordinate|null} vertex - The snapped vertex.
* @property {import("../pixel.js").Pixel|null} vertexPixel - The pixel of the snapped vertex.
* @property {import("../Feature.js").default|null} feature - The feature being snapped.
* @property {Segment|null} segment - Segment, or `null` if snapped to a vertex.
*/
/***
* @type {Object<string, Segmenter>}
*/
var GEOMETRY_SEGMENTERS = {
	/**
	* @param {import("../geom/Circle.js").default} geometry Geometry.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {Array<Segment>} Segments
	*/
	Circle(geometry, projection) {
		let circleGeometry = geometry;
		const userProjection = getUserProjection();
		if (userProjection) circleGeometry = circleGeometry.clone().transform(userProjection, projection);
		const polygon = fromCircle(circleGeometry);
		if (userProjection) polygon.transform(projection, userProjection);
		return GEOMETRY_SEGMENTERS.Polygon(polygon);
	},
	/**
	* @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
	* @param {import("../proj/Projection.js").default} projection Projection.
	* @return {Array<Segment>} Segments
	*/
	GeometryCollection(geometry, projection) {
		/** @type {Array<Array<Segment>>} */
		const segments = [];
		const geometries = geometry.getGeometriesArray();
		for (let i = 0; i < geometries.length; ++i) {
			const segmenter = this[geometries[i].getType()];
			if (segmenter) segments.push(segmenter(geometries[i], projection));
		}
		return segments.flat();
	},
	/**
	* @param {import("../geom/LineString.js").default} geometry Geometry.
	* @return {Array<Segment>} Segments
	*/
	LineString(geometry) {
		/** @type {Array<Segment>} */
		const segments = [];
		const coordinates = geometry.getFlatCoordinates();
		const stride = geometry.getStride();
		for (let i = 0, ii = coordinates.length - stride; i < ii; i += stride) segments.push([coordinates.slice(i, i + 2), coordinates.slice(i + stride, i + stride + 2)]);
		return segments;
	},
	/**
	* @param {import("../geom/MultiLineString.js").default} geometry Geometry.
	* @return {Array<Segment>} Segments
	*/
	MultiLineString(geometry) {
		/** @type {Array<Segment>} */
		const segments = [];
		const coordinates = geometry.getFlatCoordinates();
		const stride = geometry.getStride();
		const ends = geometry.getEnds();
		let offset = 0;
		for (let i = 0, ii = ends.length; i < ii; ++i) {
			const end = ends[i];
			for (let j = offset, jj = end - stride; j < jj; j += stride) segments.push([coordinates.slice(j, j + 2), coordinates.slice(j + stride, j + stride + 2)]);
			offset = end;
		}
		return segments;
	},
	/**
	* @param {import("../geom/MultiPoint.js").default} geometry Geometry.
	* @return {Array<Segment>} Segments
	*/
	MultiPoint(geometry) {
		/** @type {Array<Segment>} */
		const segments = [];
		const coordinates = geometry.getFlatCoordinates();
		const stride = geometry.getStride();
		for (let i = 0, ii = coordinates.length; i < ii; i += stride) segments.push([coordinates.slice(i, i + 2)]);
		return segments;
	},
	/**
	* @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
	* @return {Array<Segment>} Segments
	*/
	MultiPolygon(geometry) {
		/** @type {Array<Segment>} */
		const segments = [];
		const coordinates = geometry.getFlatCoordinates();
		const stride = geometry.getStride();
		const endss = geometry.getEndss();
		let offset = 0;
		for (let i = 0, ii = endss.length; i < ii; ++i) {
			const ends = endss[i];
			for (let j = 0, jj = ends.length; j < jj; ++j) {
				const end = ends[j];
				for (let k = offset, kk = end - stride; k < kk; k += stride) segments.push([coordinates.slice(k, k + 2), coordinates.slice(k + stride, k + stride + 2)]);
				offset = end;
			}
		}
		return segments;
	},
	/**
	* @param {import("../geom/Point.js").default} geometry Geometry.
	* @return {Array<Segment>} Segments
	*/
	Point(geometry) {
		return [[geometry.getFlatCoordinates().slice(0, 2)]];
	},
	/**
	* @param {import("../geom/Polygon.js").default} geometry Geometry.
	* @return {Array<Segment>} Segments
	*/
	Polygon(geometry) {
		/** @type {Array<Segment>} */
		const segments = [];
		const coordinates = geometry.getFlatCoordinates();
		const stride = geometry.getStride();
		const ends = geometry.getEnds();
		let offset = 0;
		for (let i = 0, ii = ends.length; i < ii; ++i) {
			const end = ends[i];
			for (let j = offset, jj = end - stride; j < jj; j += stride) segments.push([coordinates.slice(j, j + 2), coordinates.slice(j + stride, j + stride + 2)]);
			offset = end;
		}
		return segments;
	}
};
/**
* @param  {import("../source/Vector.js").VectorSourceEvent|import("../Collection.js").CollectionEvent<import("../Feature.js").default>} evt Event.
* @return {import("../Feature.js").default|null} Feature.
*/
function getFeatureFromEvent(evt) {
	if (evt.feature) return evt.feature;
	if (evt.element) return evt.element;
	return null;
}
var tempSegment = [];
/** @type {Array<import('../extent.js').Extent>} */
var tempExtents = [];
/** @type {Array<SegmentData>} */
var tempSegmentData = [];
/***
* @template Return
* @typedef {import("../Observable.js").OnSignature<import("../Observable.js").EventTypes, import("../events/Event.js").default, Return> &
*   import("../Observable.js").OnSignature<import("../ObjectEventType.js").Types|
*     'change:active', import("../Object.js").ObjectEvent, Return> &
*   import("../Observable.js").OnSignature<'snap'|'unsnap', SnapEvent, Return> &
*   import("../Observable.js").CombinedOnSignature<import("../Observable.js").EventTypes|import("../ObjectEventType.js").Types|
*     'change:active'|'snap'|'unsnap', Return>} SnapOnSignature
*/
/**
* @classdesc
* Handles snapping of vector features while modifying or drawing them.  The
* features can come from a {@link module:ol/source/Vector~VectorSource} or {@link module:ol/Collection~Collection}
* Any interaction object that allows the user to interact
* with the features using the mouse can benefit from the snapping, as long
* as it is added before.
*
* The snap interaction modifies map browser event `coordinate` and `pixel`
* properties to force the snap to occur to any interaction that uses them.
*
* Example:
*
*     import Snap from 'ol/interaction/Snap.js';
*
*     const snap = new Snap({
*       source: source
*     });
*
*     map.addInteraction(snap);
*
* @fires SnapEvent
* @api
*/
var Snap = class extends PointerInteraction {
	/**
	* @param {Options} [options] Options.
	*/
	constructor(options) {
		options = options ? options : {};
		super({
			handleDownEvent: TRUE,
			stopDown: FALSE
		});
		/***
		* @type {SnapOnSignature<import("../events.js").EventsKey>}
		*/
		this.on;
		/***
		* @type {SnapOnSignature<import("../events.js").EventsKey>}
		*/
		this.once;
		/***
		* @type {SnapOnSignature<void>}
		*/
		this.un;
		/**
		* @type {import("../source/Vector.js").default|null}
		* @private
		*/
		this.source_ = options.source ? options.source : null;
		/**
		* @private
		* @type {boolean}
		*/
		this.vertex_ = options.vertex !== void 0 ? options.vertex : true;
		/**
		* @private
		* @type {boolean}
		*/
		this.edge_ = options.edge !== void 0 ? options.edge : true;
		/**
		* @private
		* @type {boolean}
		*/
		this.intersection_ = options.intersection !== void 0 ? options.intersection : false;
		/**
		* @type {import("../Collection.js").default<import("../Feature.js").default>|null}
		* @private
		*/
		this.features_ = options.features ? options.features : null;
		/**
		* @type {Array<import("../events.js").EventsKey>}
		* @private
		*/
		this.featuresListenerKeys_ = [];
		/**
		* @type {Object<string, import("../events.js").EventsKey>}
		* @private
		*/
		this.featureChangeListenerKeys_ = {};
		/**
		* Extents are preserved so indexed segment can be quickly removed
		* when its feature geometry changes
		* @type {Object<string, import("../extent.js").Extent>}
		* @private
		*/
		this.indexedFeaturesExtents_ = {};
		/**
		* If a feature geometry changes while a pointer drag|move event occurs, the
		* feature doesn't get updated right away.  It will be at the next 'pointerup'
		* event fired.
		* @type {!Object<string, import("../Feature.js").default>}
		* @private
		*/
		this.pendingFeatures_ = {};
		/**
		* @type {number}
		* @private
		*/
		this.pixelTolerance_ = options.pixelTolerance !== void 0 ? options.pixelTolerance : 10;
		/**
		* Segment RTree for each layer
		* @type {import("../structs/RBush.js").default<SegmentData>}
		* @private
		*/
		this.rBush_ = new RBush();
		/**
		* Holds information about the last snapped state.
		* @type {SnappedInfo|null}
		* @private
		*/
		this.snapped_ = null;
		/**
		* @type {Object<string, Segmenter>}
		* @private
		*/
		this.segmenters_ = Object.assign({}, GEOMETRY_SEGMENTERS, options.segmenters);
	}
	/**
	* Add a feature to the collection of features that we may snap to.
	* @param {import("../Feature.js").default} feature Feature.
	* @param {boolean} [register] Whether to listen to the feature change or not
	*     Defaults to `true`.
	* @api
	*/
	addFeature(feature, register) {
		register = register !== void 0 ? register : true;
		const feature_uid = getUid(feature);
		const geometry = feature.getGeometry();
		if (geometry) {
			const segmenter = this.segmenters_[geometry.getType()];
			if (segmenter) {
				this.indexedFeaturesExtents_[feature_uid] = geometry.getExtent(createEmpty());
				const segments = segmenter.call(this.segmenters_, geometry, this.getMap().getView().getProjection());
				let segmentCount = segments.length;
				for (let i = 0; i < segmentCount; ++i) {
					const segment = segments[i];
					tempExtents[i] = boundingExtent(segment);
					tempSegmentData[i] = {
						feature,
						segment
					};
				}
				if (this.intersection_) for (let j = 0, jj = segments.length; j < jj; ++j) {
					const segment = segments[j];
					if (segment.length === 1) continue;
					const extent = tempExtents[j];
					for (let k = 0, kk = j - 1; k < kk; ++k) {
						const otherSegment = segments[k];
						if (otherSegment.length === 1 || !intersects(extent, tempExtents[k])) continue;
						const intersection = getIntersectionPoint(segment, otherSegment);
						if (!intersection) continue;
						const intersectionSegment = [intersection];
						tempExtents[segmentCount] = boundingExtent(intersectionSegment);
						tempSegmentData[segmentCount++] = {
							feature,
							intersectionFeature: feature,
							segment: intersectionSegment
						};
					}
					const otherSegments = this.rBush_.getInExtent(tempExtents[j]);
					for (let k = 0, kk = otherSegments.length; k < kk; ++k) {
						const otherSegment = otherSegments[k].segment;
						if (otherSegment.length === 1) continue;
						const intersection = getIntersectionPoint(segment, otherSegment);
						if (!intersection) continue;
						const intersectionSegment = [intersection];
						tempExtents[segmentCount] = boundingExtent(intersectionSegment);
						tempSegmentData[segmentCount++] = {
							feature,
							intersectionFeature: otherSegments[k].feature,
							segment: intersectionSegment
						};
					}
				}
				if (segmentCount === 1) this.rBush_.insert(tempExtents[0], tempSegmentData[0]);
				else {
					tempExtents.length = segmentCount;
					tempSegmentData.length = segmentCount;
					this.rBush_.load(tempExtents, tempSegmentData);
				}
			}
		}
		if (register) {
			if (this.featureChangeListenerKeys_[feature_uid]) unlistenByKey(this.featureChangeListenerKeys_[feature_uid]);
			this.featureChangeListenerKeys_[feature_uid] = listen(feature, EventType_default.CHANGE, this.handleFeatureChange_, this);
		}
	}
	/**
	* @return {import("../Collection.js").default<import("../Feature.js").default>|Array<import("../Feature.js").default>} Features.
	* @private
	*/
	getFeatures_() {
		/** @type {import("../Collection.js").default<import("../Feature.js").default>|Array<import("../Feature.js").default>} */
		let features;
		if (this.features_) features = this.features_;
		else if (this.source_) features = this.source_.getFeatures();
		return features;
	}
	/**
	* Checks if two snap data sets are equal.
	* Compares the segment and the feature.
	*
	* @param {SnappedInfo} data1 The first snap data set.
	* @param {SnappedInfo} data2 The second snap data set.
	* @return {boolean} `true` if the data sets are equal, otherwise `false`.
	* @private
	*/
	areSnapDataEqual_(data1, data2) {
		return data1.segment === data2.segment && data1.feature === data2.feature;
	}
	/**
	* @param {import("../MapBrowserEvent.js").default} evt Map browser event.
	* @return {boolean} `false` to stop event propagation.
	* @api
	* @override
	*/
	handleEvent(evt) {
		const result = this.snapTo(evt.pixel, evt.coordinate, evt.map);
		if (result) {
			evt.coordinate = result.vertex.slice(0, 2);
			evt.pixel = result.vertexPixel;
			if (this.snapped_ && !this.areSnapDataEqual_(this.snapped_, result)) this.dispatchEvent(new SnapEvent(SnapEventType.UNSNAP, this.snapped_));
			this.snapped_ = {
				vertex: evt.coordinate,
				vertexPixel: evt.pixel,
				feature: result.feature,
				segment: result.segment
			};
			this.dispatchEvent(new SnapEvent(SnapEventType.SNAP, this.snapped_));
		} else if (this.snapped_) {
			this.dispatchEvent(new SnapEvent(SnapEventType.UNSNAP, this.snapped_));
			this.snapped_ = null;
		}
		return super.handleEvent(evt);
	}
	/**
	* @param {import("../source/Vector.js").VectorSourceEvent|import("../Collection.js").CollectionEvent<import("../Feature.js").default>} evt Event.
	* @private
	*/
	handleFeatureAdd_(evt) {
		const feature = getFeatureFromEvent(evt);
		if (feature) this.addFeature(feature);
	}
	/**
	* @param {import("../source/Vector.js").VectorSourceEvent|import("../Collection.js").CollectionEvent<import("../Feature.js").default>} evt Event.
	* @private
	*/
	handleFeatureRemove_(evt) {
		const feature = getFeatureFromEvent(evt);
		if (feature) {
			this.removeFeature(feature);
			delete this.pendingFeatures_[getUid(feature)];
		}
	}
	/**
	* @param {import("../events/Event.js").default} evt Event.
	* @private
	*/
	handleFeatureChange_(evt) {
		const feature = evt.target;
		if (this.handlingDownUpSequence) this.pendingFeatures_[getUid(feature)] = feature;
		else this.updateFeature_(feature);
	}
	/**
	* Handle pointer up events.
	* @param {import("../MapBrowserEvent.js").default} evt Event.
	* @return {boolean} If the event was consumed.
	* @override
	*/
	handleUpEvent(evt) {
		const featuresToUpdate = Object.values(this.pendingFeatures_);
		if (featuresToUpdate.length) {
			for (const feature of featuresToUpdate) this.updateFeature_(feature);
			clear(this.pendingFeatures_);
		}
		return false;
	}
	/**
	* Remove a feature from the collection of features that we may snap to.
	* @param {import("../Feature.js").default} feature Feature
	* @param {boolean} [unlisten] Whether to unlisten to the feature change
	*     or not. Defaults to `true`.
	* @api
	*/
	removeFeature(feature, unlisten) {
		const unregister = unlisten !== void 0 ? unlisten : true;
		const feature_uid = getUid(feature);
		const extent = this.indexedFeaturesExtents_[feature_uid];
		if (extent) {
			const rBush = this.rBush_;
			rBush.getInExtent(extent).forEach((node) => {
				if (feature === node.feature || feature === node.intersectionFeature) rBush.remove(node);
			});
		}
		if (unregister) {
			unlistenByKey(this.featureChangeListenerKeys_[feature_uid]);
			delete this.featureChangeListenerKeys_[feature_uid];
		}
	}
	/**
	* Remove the interaction from its current map and attach it to the new map.
	* Subclasses may set up event handlers to get notified about changes to
	* the map here.
	* @param {import("../Map.js").default} map Map.
	* @override
	*/
	setMap(map) {
		const currentMap = this.getMap();
		const keys = this.featuresListenerKeys_;
		let features = this.getFeatures_();
		if (!Array.isArray(features)) features = features.getArray();
		if (currentMap) {
			keys.forEach(unlistenByKey);
			keys.length = 0;
			this.rBush_.clear();
			Object.values(this.featureChangeListenerKeys_).forEach(unlistenByKey);
			this.featureChangeListenerKeys_ = {};
		}
		super.setMap(map);
		if (map) {
			if (this.features_) keys.push(listen(this.features_, CollectionEventType_default.ADD, this.handleFeatureAdd_, this), listen(this.features_, CollectionEventType_default.REMOVE, this.handleFeatureRemove_, this));
			else if (this.source_) keys.push(listen(this.source_, VectorEventType_default.ADDFEATURE, this.handleFeatureAdd_, this), listen(this.source_, VectorEventType_default.REMOVEFEATURE, this.handleFeatureRemove_, this));
			for (const feature of features) this.addFeature(feature);
		}
	}
	/**
	* @param {import("../pixel.js").Pixel} pixel Pixel
	* @param {import("../coordinate.js").Coordinate} pixelCoordinate Coordinate
	* @param {import("../Map.js").default} map Map.
	* @return {SnappedInfo|null} Snap result
	*/
	snapTo(pixel, pixelCoordinate, map) {
		const projection = map.getView().getProjection();
		const projectedCoordinate = fromUserCoordinate(pixelCoordinate, projection);
		const box = toUserExtent(buffer(boundingExtent([projectedCoordinate]), map.getView().getResolution() * this.pixelTolerance_), projection);
		const segments = this.rBush_.getInExtent(box);
		const segmentsLength = segments.length;
		if (segmentsLength === 0) return null;
		let closestVertex;
		let minSquaredDistance = Infinity;
		let closestFeature;
		let closestSegment = null;
		const squaredPixelTolerance = this.pixelTolerance_ * this.pixelTolerance_;
		const getResult = () => {
			if (!closestVertex) return null;
			const vertexPixel = map.getPixelFromCoordinate(closestVertex);
			if (squaredDistance(pixel, vertexPixel) > squaredPixelTolerance) return null;
			return {
				vertex: closestVertex,
				vertexPixel: [Math.round(vertexPixel[0]), Math.round(vertexPixel[1])],
				feature: closestFeature,
				segment: closestSegment
			};
		};
		if (this.vertex_ || this.intersection_) {
			for (let i = 0; i < segmentsLength; ++i) {
				const segmentData = segments[i];
				if (segmentData.feature.getGeometry().getType() !== "Circle") for (const vertex of segmentData.segment) {
					const delta = squaredDistance(projectedCoordinate, fromUserCoordinate(vertex, projection));
					if (delta < minSquaredDistance && (this.intersection_ && segmentData.intersectionFeature || this.vertex_ && !segmentData.intersectionFeature)) {
						closestVertex = vertex;
						minSquaredDistance = delta;
						closestFeature = segmentData.feature;
					}
				}
			}
			const result = getResult();
			if (result) return result;
		}
		if (this.edge_) {
			for (let i = 0; i < segmentsLength; ++i) {
				let vertex = null;
				const segmentData = segments[i];
				if (segmentData.feature.getGeometry().getType() === "Circle") {
					let circleGeometry = segmentData.feature.getGeometry();
					const userProjection = getUserProjection();
					if (userProjection) circleGeometry = circleGeometry.clone().transform(userProjection, projection);
					vertex = closestOnCircle(projectedCoordinate, circleGeometry);
				} else {
					const [segmentStart, segmentEnd] = segmentData.segment;
					if (segmentEnd) {
						tempSegment[0] = fromUserCoordinate(segmentStart, projection);
						tempSegment[1] = fromUserCoordinate(segmentEnd, projection);
						vertex = closestOnSegment(projectedCoordinate, tempSegment);
					}
				}
				if (vertex) {
					const delta = squaredDistance(projectedCoordinate, vertex);
					if (delta < minSquaredDistance) {
						closestVertex = toUserCoordinate(vertex, projection);
						closestSegment = segmentData.feature.getGeometry().getType() === "Circle" ? null : segmentData.segment;
						minSquaredDistance = delta;
						closestFeature = segmentData.feature;
					}
				}
			}
			const result = getResult();
			if (result) return result;
		}
		return null;
	}
	/**
	* @param {import("../Feature.js").default} feature Feature
	* @private
	*/
	updateFeature_(feature) {
		this.removeFeature(feature, false);
		this.addFeature(feature, false);
	}
};
//#endregion
//#region src/event/condition.ts
/**
* Handy function that can be used as condition without using the condition signature.
* @param testFn The function to execute as a condition (without params).
* @returns an Ol condition function.
*/
var condition = (testFn) => {
	return (_mapBrowserEvent) => {
		return testFn();
	};
};
/**
* @param condition The condition to test.
* @param callback A callback to execute if the condition is fulfilled.
* @returns a condition function that check the given condition.
* If the condition is truthy, execute the callback.
*/
var conditionThen = (condition, callback) => {
	return (mapBrowserEvent) => {
		if (condition(mapBrowserEvent)) {
			callback(mapBrowserEvent);
			return true;
		}
		return false;
	};
};
//#endregion
//#region src/event/listen-key.ts
/**
* Listen keydown/keyup event on document for a specific keyboard key.
*/
var ListenKey = class {
	listenedKey;
	eventKeys = [];
	keyDown = false;
	keyDownCallback;
	keyUpCallback;
	/**
	* @param listenedKey the key to listen.
	*/
	constructor(listenedKey) {
		this.listenedKey = listenedKey;
		this.eventKeys.push(listen(document, "keydown", this.handleKeyDown.bind(this)), listen(document, "keyup", this.handleKeyUp.bind(this)));
	}
	/**
	* Destroy listeners. The instance is then useless.
	*/
	destroy() {
		unByKey(this.eventKeys);
	}
	/**
	* Is the key currently pressed.
	*/
	isKeyDown() {
		return this.keyDown;
	}
	/**
	* Register a callback that will be called each time the key is pressed.
	* @param callback
	*/
	setOnKeyDown(callback) {
		this.keyDownCallback = callback;
	}
	/**
	* Register a callback that will be called each time the key is released.
	* @param callback
	*/
	setOnKeyUp(callback) {
		this.keyUpCallback = callback;
	}
	/**
	* Check if the key is pressed.
	* @private
	*/
	handleKeyDown(evt) {
		if (evt instanceof KeyboardEvent && evt.key === this.listenedKey) {
			this.keyDown = true;
			if (this.keyDownCallback) this.keyDownCallback();
		}
	}
	/**
	* Check if the key is released.
	* @private
	*/
	handleKeyUp(evt) {
		if (evt instanceof KeyboardEvent && evt.key === this.listenedKey) {
			this.keyDown = false;
			if (this.keyUpCallback) this.keyUpCallback();
		}
	}
};
//#endregion
//#region src/layer/utils.ts
/**
* Set the style of a layer (only) once.
*/
var updateLayerStyle = (layer, styleFn) => {
	if (layer.get("draw-style-set")) return;
	layer.setStyle(styleFn);
	layer.set("draw-style-set", true);
};
//#endregion
//#region src/style.ts
/** Single instance of an ol empty style */
var EmptyStyle = new Style();
//#endregion
//#region examples/draw/index.ts
var layer1Id = "layer1-id";
var backgroundLayer1Id = "background1-id";
var pointInteractionId = "point-interaction-uid";
var lineInteractionId = "line-interaction-uid";
var modifyInteractionId = "modify-interaction-uid";
var mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(new View({
	center: [0, 0],
	zoom: 2
}));
mapEntry.getOlcMap().getMap().setTarget("map");
var print = (msg) => {
	document.querySelector("#console .text").textContent = msg;
};
var layer1 = new VectorLayer({ source: new VectorSource({ features: new Collection([new Feature()]) }) });
var backgroundLayer1 = new TileLayer({ source: new OSM() });
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
var drawPoint;
var drawLine;
var modify;
var translate;
var snap;
var listenKey;
var eventKeys = [];
/**
* Create and configure map interaction to draw.
* That's a full example with draw, modification, translation, deletion with
* custom condition, and custom styling.
*/
var setupDrawing = () => {
	const drawLayer = mapEntry.getOlcOverlayLayer().findLayer(layer1Id);
	const source = drawLayer?.getSource();
	if (!drawLayer || !source) {
		console.error("No layer source or no map to draw in.");
		return;
	}
	updateLayerStyle(drawLayer, createStyle);
	listenKey = new ListenKey("Delete");
	drawPoint = new Draw({
		source,
		type: "Point",
		condition: () => !listenKey?.isKeyDown(),
		style: createStyle
	});
	mapEntry.getOlcDrawInteractionGroup().add(pointInteractionId, drawPoint);
	drawLine = new Draw({
		source,
		type: "LineString",
		condition: () => !listenKey?.isKeyDown(),
		style: createStyle
	});
	mapEntry.getOlcDrawInteractionGroup().add(lineInteractionId, drawLine);
	modify = new Modify({
		source,
		style: createStyle,
		deleteCondition: conditionThen(overEvery([click, condition(() => listenKey.isKeyDown())]), delayOnDeleteAction.bind(void 0))
	});
	mapEntry.getOlcModifyInteractionGroup().add(modifyInteractionId, modify);
	translate = new Translate({
		layers: [drawLayer],
		condition: platformModifierKeyOnly
	});
	mapEntry.getOlcModifyInteractionGroup().add("translate", translate);
	snap = new Snap({ source });
	mapEntry.getOlcModifyInteractionGroup().add("snap", snap);
	const pointInteraction = mapEntry.getOlcDrawInteractionGroup().find(pointInteractionId);
	const lineInteraction = mapEntry.getOlcDrawInteractionGroup().find(lineInteractionId);
	eventKeys.push(pointInteraction.on("drawend", () => {
		print(`Point added.`);
	}), lineInteraction.on("drawend", () => {
		print(`Line added.`);
	}));
};
/**
* Not ol-comfy, but nice to have to customize style.
*/
var createStyle = (feature) => {
	const geometry = feature?.getGeometry();
	const type = geometry?.getType();
	if (["MultiPoint", "Point"].includes(`${type}`) && geometry) {
		const xCoordinate = geometry.getCoordinates()[0] ?? 0;
		const color = Math.round(Math.abs(xCoordinate) / (20037508 / 2) * 255);
		return new Style({ image: new CircleStyle({
			radius: 8,
			fill: new Fill({ color: `rgba(${color}, 0, 0, 0.7)` }),
			stroke: new Stroke({ color: `rgba(${color}, 0, 0, 0.7)` })
		}) });
	} else if (["LineString", "MultiLineString"].includes(`${type}`) && geometry) return new Style({ stroke: new Stroke({
		color: "rgba(200, 150, 0, 0.8)",
		width: 4
	}) });
	else return EmptyStyle;
};
/**
* Delay the delete action to be sure that the OpenLayers is not
* currently modifying the feature. (Like in lines, it seems to quickly
* add then removes the coordinates on click, even with conditions).
*/
var delayOnDeleteAction = (mapBrowserEvent) => {
	setTimeout(() => onDeleteAction(mapBrowserEvent), 20);
};
/**
* Not ol-comfy but nice to have to delete feature.
* It's given as a callback to the ol-comfy delete condition.
*/
var onDeleteAction = (mapBrowserEvent) => {
	const overlayLayerGroup = mapEntry.getOlcOverlayLayer();
	mapBrowserEvent.map.forEachFeatureAtPixel(mapBrowserEvent.pixel, (feature) => {
		if (!overlayLayerGroup || feature instanceof RenderFeature) return;
		const geometry = feature.getGeometry();
		if (!geometry || geometry.getType() === "LineString" && geometry.getCoordinates().length > 2) return;
		if ((overlayLayerGroup.getFeaturesCollection(layer1Id)?.getArray() || []).includes(feature)) {
			overlayLayerGroup.removeFeatures(layer1Id, [feature]);
			const modify = mapEntry.getOlcModifyInteractionGroup().find(modifyInteractionId);
			modify?.setActive(false);
			modify?.setActive(true);
		}
	});
};
setupDrawing();
mapEntry.getOlcDrawInteractionGroup().setActive(true, pointInteractionId);
document.getElementById("type").addEventListener("change", (evt) => {
	if (evt.target.value === "point") mapEntry.getOlcDrawInteractionGroup().setActive(true, pointInteractionId);
	else mapEntry.getOlcDrawInteractionGroup().setActive(true, lineInteractionId);
});
//#endregion
