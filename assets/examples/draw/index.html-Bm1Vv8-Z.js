import { c as PointerInteraction, d as TRUE, e as always, I as InteractionProperty, C as Collection, f as fromUserCoordinate, g as BaseEvent, p as primaryAction, h as altKeyOnly, s as singleClick, V as VectorLayer, i as CollectionEventType, E as EventType, j as boundingExtent, k as createOrUpdateFromCoordinate, l as Point, m as MapBrowserEventType, n as getUid, o as equals, q as distance, r as closestOnSegment, t as toUserCoordinate, u as fromUserExtent, v as toUserExtent, w as buffer, x as squaredDistance, y as equals$1, z as never, A as createEditingStyle, D as squaredDistanceToSegment, F as FALSE, G as createEmpty, H as intersects, J as getIntersectionPoint, K as unlistenByKey, L as listen, N as clear, Q as closestOnCircle, R as fromCircle, S as unByKey, U as Style, a as View, T as TileLayer, O as OSM, W as overEvery, X as platformModifierKeyOnly, Y as CircleStyle, _ as Stroke, $ as Fill, a0 as click } from "../../overlay-layer-group-BfY9vUif.js";
import { F as Feature, R as RBush, V as VectorSource, a as VectorEventType, b as RenderFeature } from "../../Vector-B4qeoSRe.js";
import { g as getTraceTargetUpdate, a as getTraceTargets, b as getCoordinate, D as Draw } from "../../Draw-BpCrSsWU.js";
import { s as storeManager } from "../../store-manager-Co3Dgiy_.js";
import "../../LineString-MY1gkKNK.js";
const TranslateEventType = {
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
class TranslateEvent extends BaseEvent {
  /**
   * @param {TranslateEventType} type Type.
   * @param {Collection<Feature>} features The features translated.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../coordinate.js").Coordinate} startCoordinate The original coordinates before.translation started
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   */
  constructor(type, features, coordinate, startCoordinate, mapBrowserEvent) {
    super(type);
    this.features = features;
    this.coordinate = coordinate;
    this.startCoordinate = startCoordinate;
    this.mapBrowserEvent = mapBrowserEvent;
  }
}
class Translate extends PointerInteraction {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    super(
      /** @type {import("./Pointer.js").Options} */
      options
    );
    this.on;
    this.once;
    this.un;
    this.lastCoordinate_ = null;
    this.startCoordinate_ = null;
    this.features_ = options.features !== void 0 ? options.features : null;
    let layerFilter;
    if (options.layers && !this.features_) {
      if (typeof options.layers === "function") {
        layerFilter = options.layers;
      } else {
        const layers = options.layers;
        layerFilter = function(layer) {
          return layers.includes(layer);
        };
      }
    } else {
      layerFilter = TRUE;
    }
    this.layerFilter_ = layerFilter;
    this.filter_ = options.filter && !this.features_ ? options.filter : TRUE;
    this.hitTolerance_ = options.hitTolerance ? options.hitTolerance : 0;
    this.condition_ = options.condition ? options.condition : always;
    this.lastFeature_ = null;
    this.addChangeListener(
      InteractionProperty.ACTIVE,
      this.handleActiveChanged_
    );
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(event) {
    if (!event.originalEvent || !this.condition_(event)) {
      return false;
    }
    this.lastFeature_ = this.featuresAtPixel_(event.pixel, event.map);
    if (!this.lastCoordinate_ && this.lastFeature_) {
      this.startCoordinate_ = event.coordinate;
      this.lastCoordinate_ = event.coordinate;
      this.handleMoveEvent(event);
      const features = this.features_ || new Collection([this.lastFeature_]);
      this.dispatchEvent(
        new TranslateEvent(
          TranslateEventType.TRANSLATESTART,
          features,
          event.coordinate,
          this.startCoordinate_,
          event
        )
      );
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
      this.dispatchEvent(
        new TranslateEvent(
          TranslateEventType.TRANSLATEEND,
          features,
          event.coordinate,
          this.startCoordinate_,
          event
        )
      );
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
      event.map.getView().getProjection();
      const newViewCoordinate = fromUserCoordinate(newCoordinate);
      const lastViewCoordinate = fromUserCoordinate(
        this.lastCoordinate_
      );
      const deltaX = newViewCoordinate[0] - lastViewCoordinate[0];
      const deltaY = newViewCoordinate[1] - lastViewCoordinate[1];
      const features = this.features_ || new Collection([this.lastFeature_]);
      features.forEach(function(feature) {
        const geom = feature.getGeometry();
        {
          geom.translate(deltaX, deltaY);
        }
        feature.setGeometry(geom);
      });
      this.lastCoordinate_ = newCoordinate;
      this.dispatchEvent(
        new TranslateEvent(
          TranslateEventType.TRANSLATING,
          features,
          newCoordinate,
          this.startCoordinate_,
          event
        )
      );
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
    } else {
      elem.classList.remove("ol-grab", "ol-grabbing");
    }
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
    return map.forEachFeatureAtPixel(
      pixel,
      (feature, layer) => {
        if (!(feature instanceof Feature) || !this.filter_(feature, layer)) {
          return void 0;
        }
        if (this.features_ && !this.features_.getArray().includes(feature)) {
          return void 0;
        }
        return feature;
      },
      {
        layerFilter: this.layerFilter_,
        hitTolerance: this.hitTolerance_
      }
    );
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
      if (map) {
        const elem = map.getViewport();
        elem.classList.remove("ol-grab", "ol-grabbing");
      }
    }
  }
}
const CIRCLE_CENTER_INDEX = 0;
const CIRCLE_CIRCUMFERENCE_INDEX = 1;
const tempExtent = [0, 0, 0, 0];
const tempSegment$1 = [];
const ModifyEventType = {
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
  }
  return coordinatesArray;
}
class ModifyEvent extends BaseEvent {
  /**
   * @param {ModifyEventType} type Type.
   * @param {Collection<Feature>} features
   * The features modified.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent
   * Associated {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   */
  constructor(type, features, mapBrowserEvent) {
    super(type);
    this.features = features;
    this.mapBrowserEvent = mapBrowserEvent;
  }
}
class Modify extends PointerInteraction {
  /**
   * @param {Options} options Options.
   */
  constructor(options) {
    super(
      /** @type {import("./Pointer.js").Options} */
      options
    );
    this.on;
    this.once;
    this.un;
    this.boundHandleFeatureChange_ = this.handleFeatureChange_.bind(this);
    this.condition_ = options.condition ? options.condition : primaryAction;
    this.defaultDeleteCondition_ = function(mapBrowserEvent) {
      return altKeyOnly(mapBrowserEvent) && singleClick(mapBrowserEvent);
    };
    this.deleteCondition_ = options.deleteCondition ? options.deleteCondition : this.defaultDeleteCondition_;
    this.insertVertexCondition_ = options.insertVertexCondition ? options.insertVertexCondition : always;
    this.vertexFeature_ = null;
    this.vertexSegments_ = null;
    this.lastCoordinate_ = [0, 0];
    this.ignoreNextSingleClick_ = false;
    this.featuresBeingModified_ = null;
    this.rBush_ = new RBush();
    this.pixelTolerance_ = options.pixelTolerance !== void 0 ? options.pixelTolerance : 10;
    this.snappedToVertex_ = false;
    this.changingFeature_ = false;
    this.dragSegments_ = [];
    this.overlay_ = new VectorLayer({
      source: new VectorSource({
        useSpatialIndex: false,
        wrapX: !!options.wrapX
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });
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
    this.source_ = null;
    this.traceSource_ = options.traceSource || options.source || null;
    this.traceCondition_;
    this.setTrace(options.trace || false);
    this.traceState_ = { active: false };
    this.traceSegments_ = null;
    this.hitDetection_ = null;
    let features;
    if (options.features) {
      features = options.features;
    } else if (options.source) {
      this.source_ = options.source;
      features = new Collection(this.source_.getFeatures());
      this.source_.addEventListener(
        VectorEventType.ADDFEATURE,
        this.handleSourceAdd_.bind(this)
      );
      this.source_.addEventListener(
        VectorEventType.REMOVEFEATURE,
        this.handleSourceRemove_.bind(this)
      );
    }
    if (!features) {
      throw new Error(
        "The modify interaction requires features, a source or a layer"
      );
    }
    if (options.hitDetection) {
      this.hitDetection_ = options.hitDetection;
    }
    this.features_ = features;
    this.features_.forEach(this.addFeature_.bind(this));
    this.features_.addEventListener(
      CollectionEventType.ADD,
      this.handleFeatureAdd_.bind(this)
    );
    this.features_.addEventListener(
      CollectionEventType.REMOVE,
      this.handleFeatureRemove_.bind(this)
    );
    this.lastPointerEvent_ = null;
    this.delta_ = [0, 0];
    this.snapToPointer_ = options.snapToPointer === void 0 ? !this.hitDetection_ : options.snapToPointer;
  }
  /**
   * Toggle tracing mode or set a tracing condition.
   *
   * @param {boolean|import("../events/condition.js").Condition} trace A boolean to toggle tracing mode or an event
   *     condition that will be checked when a feature is clicked to determine if tracing should be active.
   */
  setTrace(trace) {
    let condition2;
    if (!trace) {
      condition2 = never;
    } else if (trace === true) {
      condition2 = always;
    } else {
      condition2 = trace;
    }
    this.traceCondition_ = condition2;
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  addFeature_(feature) {
    const geometry = feature.getGeometry();
    if (geometry) {
      const writer = this.SEGMENT_WRITERS_[geometry.getType()];
      if (writer) {
        writer(feature, geometry);
      }
    }
    const map = this.getMap();
    if (map && map.isRendered() && this.getActive()) {
      this.handlePointerAtPixel_(this.lastCoordinate_);
    }
    feature.addEventListener(EventType.CHANGE, this.boundHandleFeatureChange_);
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
        if (feature && !features.includes(feature)) {
          this.featuresBeingModified_.push(feature);
        }
      }
      if (this.featuresBeingModified_.getLength() === 0) {
        this.featuresBeingModified_ = null;
      } else {
        this.dispatchEvent(
          new ModifyEvent(
            ModifyEventType.MODIFYSTART,
            this.featuresBeingModified_,
            evt
          )
        );
      }
    }
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  removeFeature_(feature) {
    this.removeFeatureSegmentData_(feature);
    if (this.vertexFeature_ && this.features_.getLength() === 0) {
      this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
    feature.removeEventListener(
      EventType.CHANGE,
      this.boundHandleFeatureChange_
    );
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  removeFeatureSegmentData_(feature) {
    const rBush = this.rBush_;
    const nodesToRemove = [];
    rBush.forEach(
      /**
       * @param {SegmentData} node RTree node.
       */
      function(node) {
        if (feature === node.feature) {
          nodesToRemove.push(node);
        }
      }
    );
    for (let i = nodesToRemove.length - 1; i >= 0; --i) {
      const nodeToRemove = nodesToRemove[i];
      for (let j = this.dragSegments_.length - 1; j >= 0; --j) {
        if (this.dragSegments_[j][0] === nodeToRemove) {
          this.dragSegments_.splice(j, 1);
        }
      }
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
    if (event.feature) {
      this.features_.push(event.feature);
    }
  }
  /**
   * @param {import("../source/Vector.js").VectorSourceEvent} event Event.
   * @private
   */
  handleSourceRemove_(event) {
    if (event.feature) {
      this.features_.remove(event.feature);
    }
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  handleFeatureAdd_(evt) {
    this.addFeature_(evt.element);
  }
  /**
   * @param {import("../events/Event.js").default} evt Event.
   * @private
   */
  handleFeatureChange_(evt) {
    if (!this.changingFeature_) {
      const feature = (
        /** @type {Feature} */
        evt.target
      );
      this.removeFeature_(feature);
      this.addFeature_(feature);
    }
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  handleFeatureRemove_(evt) {
    this.removeFeature_(evt.element);
  }
  /**
   * @param {Feature} feature Feature
   * @param {Point} geometry Geometry.
   * @private
   */
  writePointGeometry_(feature, geometry) {
    const coordinates = geometry.getCoordinates();
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
    const centerSegmentData = {
      feature,
      geometry,
      index: CIRCLE_CENTER_INDEX,
      segment: [coordinates, coordinates]
    };
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
    let circleGeometry = (
      /** @type {import("../geom/Geometry.js").default} */
      geometry
    );
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
      const geometry2 = geometries[i];
      const writer = this.SEGMENT_WRITERS_[geometry2.getType()];
      writer(feature, geometry2);
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
    } else {
      const geometry = vertexFeature.getGeometry();
      geometry.setCoordinates(coordinates);
    }
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
    if (!mapBrowserEvent.originalEvent) {
      return true;
    }
    this.lastPointerEvent_ = mapBrowserEvent;
    let handled;
    if (!mapBrowserEvent.map.getView().getInteracting() && mapBrowserEvent.type == MapBrowserEventType.POINTERMOVE && !this.handlingDownUpSequence) {
      this.handlePointerMove_(mapBrowserEvent);
    }
    if (this.vertexFeature_ && this.deleteCondition_(mapBrowserEvent)) {
      if (mapBrowserEvent.type != MapBrowserEventType.SINGLECLICK || !this.ignoreNextSingleClick_) {
        handled = this.removePoint();
      } else {
        handled = true;
      }
    }
    if (mapBrowserEvent.type == MapBrowserEventType.SINGLECLICK) {
      this.ignoreNextSingleClick_ = false;
    }
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
    const vertexFeature = this.vertexFeature_;
    if (!vertexFeature) {
      return;
    }
    this.getMap().getView().getProjection();
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
      if (depth) {
        uid += "-" + depth.join("-");
      }
      if (!componentSegments[uid]) {
        componentSegments[uid] = new Array(2);
      }
      if (segmentDataMatch.geometry.getType() === "Circle" && segmentDataMatch.index === CIRCLE_CIRCUMFERENCE_INDEX) {
        const closestVertex = closestOnSegmentData(
          pixelCoordinate,
          segmentDataMatch
        );
        if (equals(closestVertex, vertex) && !componentSegments[uid][0]) {
          this.dragSegments_.push([segmentDataMatch, 0]);
          componentSegments[uid][0] = segmentDataMatch;
        }
        continue;
      }
      if (equals(segment[0], vertex) && !componentSegments[uid][0]) {
        this.dragSegments_.push([segmentDataMatch, 0]);
        componentSegments[uid][0] = segmentDataMatch;
        continue;
      }
      if (equals(segment[1], vertex) && !componentSegments[uid][1]) {
        if (componentSegments[uid][0] && componentSegments[uid][0].index === 0) {
          let coordinates = segmentDataMatch.geometry.getCoordinates();
          switch (segmentDataMatch.geometry.getType()) {
            // prevent dragging closed linestrings by the connecting node
            case "LineString":
            case "MultiLineString":
              continue;
            // if dragging the first vertex of a polygon, ensure the other segment
            // belongs to the closing vertex of the linear ring
            case "MultiPolygon":
              coordinates = coordinates[depth[1]];
            /* falls through */
            case "Polygon":
              if (segmentDataMatch.index !== coordinates[depth[0]].length - 2) {
                continue;
              }
              break;
          }
        }
        this.dragSegments_.push([segmentDataMatch, 1]);
        componentSegments[uid][1] = segmentDataMatch;
        continue;
      }
      if (getUid(segment) in this.vertexSegments_ && !componentSegments[uid][0] && !componentSegments[uid][1]) {
        insertVertices.push(segmentDataMatch);
      }
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
    if (!traceState.active) {
      return;
    }
    if (traceState.targetIndex === -1) {
      const startPx = event.map.getPixelFromCoordinate(traceState.startCoord);
      if (distance(startPx, event.pixel) < this.pixelTolerance_) {
        return;
      }
    }
    const updatedTraceTarget = getTraceTargetUpdate(
      event.coordinate,
      traceState,
      event.map,
      this.pixelTolerance_
    );
    if (traceState.targetIndex === -1 && Math.sqrt(updatedTraceTarget.closestTargetDistance) / event.map.getView().getResolution() > this.pixelTolerance_) {
      return;
    }
    if (traceState.targetIndex !== updatedTraceTarget.index) {
      if (traceState.targetIndex !== -1) {
        const oldTarget = traceState.targets[traceState.targetIndex];
        this.removeTracedCoordinates_(oldTarget.startIndex, oldTarget.endIndex);
      } else {
        for (const traceSegment of this.traceSegments_) {
          const segmentData = traceSegment[0];
          const geometry = segmentData.geometry;
          const index = traceSegment[1];
          const coordinates = geometry.getCoordinates();
          const coordinatesArray = getCoordinatesArray(
            coordinates,
            geometry.getType(),
            segmentData.depth
          );
          coordinatesArray.splice(segmentData.index + index, 1);
          geometry.setCoordinates(coordinates);
          if (index === 0) {
            segmentData.index -= 1;
          }
        }
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
  }
  getTraceCandidates_(event) {
    const map = this.getMap();
    const tolerance = this.pixelTolerance_;
    const lowerLeft = map.getCoordinateFromPixel([
      event.pixel[0] - tolerance,
      event.pixel[1] + tolerance
    ]);
    const upperRight = map.getCoordinateFromPixel([
      event.pixel[0] + tolerance,
      event.pixel[1] - tolerance
    ]);
    const extent = boundingExtent([lowerLeft, upperRight]);
    const features = this.traceSource_.getFeaturesInExtent(extent);
    return features;
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
      this.traceSegments_ = null;
      return;
    }
    const features = this.getTraceCandidates_(event);
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
   * @param {import('./tracing.js').TraceTarget} target The trace target.
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
      for (const traceSegment of this.traceSegments_) {
        const segmentData = traceSegment[0];
        const geometry = segmentData.geometry;
        const index = traceSegment[1];
        let removeIndex = traceSegment[0].index + 1;
        if (index === 1) {
          removeIndex -= remove;
        }
        const coordinates = geometry.getCoordinates();
        const coordinatesArray = getCoordinatesArray(
          coordinates,
          geometry.getType(),
          segmentData.depth
        );
        coordinatesArray.splice(removeIndex, remove);
        geometry.setCoordinates(coordinates);
        if (index === 1) {
          segmentData.index -= remove;
        }
      }
    }
  }
  /**
   * @param {import('./tracing.js').TraceTarget} target The trace target.
   * @param {number} fromIndex The start index.
   * @param {number} toIndex The end index.
   * @private
   */
  addTracedCoordinates_(target, fromIndex, toIndex) {
    if (fromIndex === toIndex) {
      return;
    }
    const newCoordinates = [];
    if (fromIndex < toIndex) {
      const start = Math.ceil(fromIndex);
      let end = Math.floor(toIndex);
      if (end === toIndex) {
        end -= 1;
      }
      for (let i = start; i <= end; ++i) {
        newCoordinates.push(getCoordinate(target.coordinates, i));
      }
    } else {
      const start = Math.floor(fromIndex);
      let end = Math.ceil(toIndex);
      if (end === toIndex) {
        end += 1;
      }
      for (let i = start; i >= end; --i) {
        newCoordinates.push(getCoordinate(target.coordinates, i));
      }
    }
    if (newCoordinates.length) {
      for (const traceSegment of this.traceSegments_) {
        const segmentData = traceSegment[0];
        const geometry = segmentData.geometry;
        const index = traceSegment[1];
        const insertIndex = segmentData.index + 1;
        if (index === 0) {
          newCoordinates.reverse();
        }
        const coordinates = geometry.getCoordinates();
        const coordinatesArray = getCoordinatesArray(
          coordinates,
          geometry.getType(),
          segmentData.depth
        );
        coordinatesArray.splice(insertIndex, 0, ...newCoordinates);
        geometry.setCoordinates(coordinates);
        if (index === 1) {
          segmentData.index += newCoordinates.length;
        }
      }
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
    while (vertex.length < geometry.getStride()) {
      vertex.push(segment[index][vertex.length]);
    }
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
      case "Polygon":
        coordinates = geometry.getCoordinates();
        coordinates[depth[0]][segmentData.index + index] = vertex;
        segment[index] = vertex;
        break;
      case "MultiPolygon":
        coordinates = geometry.getCoordinates();
        coordinates[depth[1]][depth[0]][segmentData.index + index] = vertex;
        segment[index] = vertex;
        break;
      case "Circle":
        const circle = (
          /** @type {import("../geom/Circle.js").default} */
          geometry
        );
        segment[0] = vertex;
        segment[1] = vertex;
        if (segmentData.index === CIRCLE_CENTER_INDEX) {
          this.changingFeature_ = true;
          circle.setCenter(vertex);
          this.changingFeature_ = false;
        } else {
          this.changingFeature_ = true;
          this.getMap().getView().getProjection();
          let radius = distance(
            fromUserCoordinate(circle.getCenter()),
            fromUserCoordinate(vertex)
          );
          circle.setRadius(radius);
          this.changingFeature_ = false;
        }
        break;
    }
    if (coordinates) {
      this.setGeometryCoordinates_(geometry, coordinates);
    }
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} evt Event.
   * @override
   */
  handleDragEvent(evt) {
    this.ignoreNextSingleClick_ = false;
    this.willModifyFeatures_(
      evt,
      this.dragSegments_.map(([segment]) => segment)
    );
    const vertex = [
      evt.coordinate[0] + this.delta_[0],
      evt.coordinate[1] + this.delta_[1]
    ];
    const features = [];
    const geometries = [];
    const startTraceCoord = this.traceState_.active && !this.traceSegments_ ? this.traceState_.startCoord : null;
    if (startTraceCoord) {
      this.traceSegments_ = [];
      for (const dragSegment of this.dragSegments_) {
        const segmentData = dragSegment[0];
        const eligibleForTracing = distance(
          closestOnSegment(startTraceCoord, segmentData.segment),
          startTraceCoord
        ) / evt.map.getView().getResolution() < 1;
        if (eligibleForTracing) {
          this.traceSegments_.push(dragSegment);
        }
      }
    }
    for (let i = 0, ii = this.dragSegments_.length; i < ii; ++i) {
      const dragSegment = this.dragSegments_[i];
      const segmentData = dragSegment[0];
      const feature = segmentData.feature;
      if (!features.includes(feature)) {
        features.push(feature);
      }
      const geometry = segmentData.geometry;
      if (!geometries.includes(geometry)) {
        geometries.push(geometry);
      }
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
    if (!this.condition_(evt)) {
      return false;
    }
    const pixelCoordinate = evt.coordinate;
    const insertVertices = this.findInsertVerticesAndUpdateDragSegments_(pixelCoordinate);
    if (insertVertices?.length && this.insertVertexCondition_(evt)) {
      this.willModifyFeatures_(evt, insertVertices);
      if (this.vertexFeature_) {
        const vertex = this.vertexFeature_.getGeometry().getCoordinates();
        for (let j = insertVertices.length - 1; j >= 0; --j) {
          this.insertVertex_(insertVertices[j], vertex);
        }
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
        const circle = (
          /** @type {import("../geom/Circle.js").default} */
          geometry
        );
        const coordinates = circle.getCenter();
        const centerSegmentData = segmentData.featureSegments[0];
        const circumferenceSegmentData = segmentData.featureSegments[1];
        centerSegmentData.segment[0] = coordinates;
        centerSegmentData.segment[1] = coordinates;
        circumferenceSegmentData.segment[0] = coordinates;
        circumferenceSegmentData.segment[1] = coordinates;
        this.rBush_.update(createOrUpdateFromCoordinate(coordinates), centerSegmentData);
        let circleGeometry = circle;
        this.rBush_.update(
          circleGeometry.getExtent(),
          circumferenceSegmentData
        );
      } else {
        this.rBush_.update(boundingExtent(segmentData.segment), segmentData);
      }
    }
    if (this.featuresBeingModified_) {
      this.toggleTraceState_(evt);
      this.dispatchEvent(
        new ModifyEvent(
          ModifyEventType.MODIFYEND,
          this.featuresBeingModified_,
          evt
        )
      );
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
    map.getView().getProjection();
    const sortByDistance = function(a, b) {
      return projectedDistanceToSegmentDataSquared(pixelCoordinate, a) - projectedDistanceToSegmentDataSquared(pixelCoordinate, b);
    };
    let nodes;
    let hitPointGeometry;
    if (this.hitDetection_) {
      const layerFilter = typeof this.hitDetection_ === "object" ? (layer) => layer === this.hitDetection_ : void 0;
      map.forEachFeatureAtPixel(
        pixel,
        (feature, layer, geometry) => {
          if (geometry && geometry.getType() === "Point") {
            geometry = new Point(
              toUserCoordinate(geometry.getCoordinates())
            );
          }
          const geom = geometry || feature.getGeometry();
          if (geom && geom.getType() === "Point" && feature instanceof Feature && this.features_.getArray().includes(feature)) {
            hitPointGeometry = /** @type {Point} */
            geom;
            const coordinate = (
              /** @type {Point} */
              feature.getGeometry().getFlatCoordinates().slice(0, 2)
            );
            nodes = [
              {
                feature,
                geometry: hitPointGeometry,
                segment: [coordinate, coordinate]
              }
            ];
          }
          return true;
        },
        { layerFilter }
      );
    }
    if (!nodes) {
      const viewExtent = fromUserExtent(
        createOrUpdateFromCoordinate(pixelCoordinate, tempExtent)
      );
      const buffer$1 = map.getView().getResolution() * this.pixelTolerance_;
      const box = toUserExtent(
        buffer(viewExtent, buffer$1, tempExtent)
      );
      nodes = this.rBush_.getInExtent(box);
    }
    if (nodes && nodes.length > 0) {
      const node = nodes.sort(sortByDistance)[0];
      const closestSegment = node.segment;
      let vertex = closestOnSegmentData(pixelCoordinate, node);
      const vertexPixel = map.getPixelFromCoordinate(vertex);
      let dist = distance(pixel, vertexPixel);
      if (hitPointGeometry || dist <= this.pixelTolerance_) {
        const vertexSegments = {};
        vertexSegments[getUid(closestSegment)] = true;
        if (!this.snapToPointer_) {
          this.delta_[0] = vertex[0] - pixelCoordinate[0];
          this.delta_[1] = vertex[1] - pixelCoordinate[1];
        }
        if (node.geometry.getType() === "Circle" && node.index === CIRCLE_CIRCUMFERENCE_INDEX) {
          this.snappedToVertex_ = true;
          this.createOrUpdateVertexFeature_(
            vertex,
            [node.feature],
            [node.geometry],
            this.snappedToVertex_
          );
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
          if (this.snappedToVertex_) {
            vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
          }
          this.createOrUpdateVertexFeature_(
            vertex,
            [node.feature],
            [node.geometry],
            this.snappedToVertex_
          );
          const geometries = {};
          geometries[getUid(node.geometry)] = true;
          for (let i = 1, ii = nodes.length; i < ii; ++i) {
            const segment = nodes[i].segment;
            if (equals(closestSegment[0], segment[0]) && equals(closestSegment[1], segment[1]) || equals(closestSegment[0], segment[1]) && equals(closestSegment[1], segment[0])) {
              const geometryUid = getUid(nodes[i].geometry);
              if (!(geometryUid in geometries)) {
                geometries[geometryUid] = true;
                vertexSegments[getUid(segment)] = true;
              }
            } else {
              break;
            }
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
    while (vertex.length < geometry.getStride()) {
      vertex.push(0);
    }
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
      default:
        return false;
    }
    this.setGeometryCoordinates_(geometry, coordinates);
    const rTree = this.rBush_;
    rTree.remove(segmentData);
    this.updateSegmentIndices_(geometry, index, depth, 1);
    const newSegmentData = {
      segment: [segment[0], vertex],
      feature,
      geometry,
      depth,
      index
    };
    rTree.insert(boundingExtent(newSegmentData.segment), newSegmentData);
    this.dragSegments_.push([newSegmentData, 1]);
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
    if (coordinate) {
      this.findInsertVerticesAndUpdateDragSegments_(coordinate);
    }
    return this.vertexFeature_?.getGeometry().getCoordinates();
  }
  /**
   * Get the current pointer position.
   * @return {import("../coordinate.js").Coordinate | null} The current pointer coordinate.
   */
  getPoint() {
    const coordinate = this.vertexFeature_?.getGeometry().getCoordinates();
    if (!coordinate) {
      return null;
    }
    return toUserCoordinate(
      coordinate,
      this.getMap().getView().getProjection()
    );
  }
  /**
   * Check if a point can be removed from the current linestring or polygon at the current
   * pointer position.
   * @return {boolean} A point can be deleted at the current pointer position.
   * @api
   */
  canRemovePoint() {
    if (!this.vertexFeature_) {
      return false;
    }
    if (this.vertexFeature_.get("geometries").every(
      (geometry) => geometry.getType() === "Circle" || geometry.getType().endsWith("Point")
    )) {
      return false;
    }
    const coordinate = this.vertexFeature_.getGeometry().getCoordinates();
    const segments = this.rBush_.getInExtent(boundingExtent([coordinate]));
    return segments.some(
      ({ segment }) => equals(segment[0], coordinate) || equals(segment[1], coordinate)
    );
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
      coordinate = fromUserCoordinate(
        coordinate,
        this.getMap().getView().getProjection()
      );
      this.updatePointer_(coordinate);
    }
    if (!this.lastPointerEvent_ || this.lastPointerEvent_ && this.lastPointerEvent_.type != MapBrowserEventType.POINTERDRAG) {
      const evt = this.lastPointerEvent_;
      this.willModifyFeatures_(
        evt,
        this.dragSegments_.map(([segment]) => segment)
      );
      const removed = this.removeVertex_();
      if (this.featuresBeingModified_) {
        this.dispatchEvent(
          new ModifyEvent(
            ModifyEventType.MODIFYEND,
            this.featuresBeingModified_,
            evt
          )
        );
      }
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
      if (segmentData.depth) {
        uid += "-" + segmentData.depth.join("-");
      }
      if (!(uid in segmentsByFeature)) {
        segmentsByFeature[uid] = {};
      }
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
      if (left !== void 0) {
        segmentData = left;
      } else {
        segmentData = right;
      }
      if (newIndex < 0) {
        newIndex = 0;
      }
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
        case "MultiPolygon":
          component = component[segmentData.depth[1]];
        /* falls through */
        case "Polygon":
          component = component[segmentData.depth[0]];
          if (component.length > 4) {
            if (index == component.length - 1) {
              index = 0;
            }
            component.splice(index, 1);
            deleted = true;
            if (index === 0) {
              component.pop();
              component.push(component[0]);
              newIndex = component.length - 1;
            }
          }
          break;
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
          const newSegmentData = {
            depth: segmentData.depth,
            feature: segmentData.feature,
            geometry: segmentData.geometry,
            index: newIndex,
            segment: segments
          };
          this.rBush_.insert(
            boundingExtent(newSegmentData.segment),
            newSegmentData
          );
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
    if (!this.vertexFeature_) {
      return false;
    }
    if (this.vertexFeature_.get("geometries").every(
      (geometry) => geometry.getType() === "Circle" || geometry.getType().endsWith("Point")
    )) {
      return false;
    }
    const coordinate = this.vertexFeature_.getGeometry().getCoordinates();
    const segments = this.rBush_.getInExtent(boundingExtent([coordinate]));
    return segments.some(
      ({ segment }) => !(equals(segment[0], coordinate) || equals(segment[1], coordinate))
    );
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
    if (!pixelCoordinate) {
      return false;
    }
    const insertVertices = this.findInsertVerticesAndUpdateDragSegments_(pixelCoordinate);
    return insertVertices.reduce(
      (prev, segmentData) => prev || this.insertVertex_(segmentData, pixelCoordinate),
      false
    );
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
    this.rBush_.forEachInExtent(
      geometry.getExtent(),
      function(segmentDataMatch) {
        if (segmentDataMatch.geometry === geometry && (depth === void 0 || segmentDataMatch.depth === void 0 || equals$1(segmentDataMatch.depth, depth)) && segmentDataMatch.index > index) {
          segmentDataMatch.index += delta;
        }
      }
    );
  }
}
function compareIndexes(a, b) {
  return a.index - b.index;
}
function projectedDistanceToSegmentDataSquared(pointCoordinates, segmentData, projection) {
  const geometry = segmentData.geometry;
  if (geometry.getType() === "Circle") {
    let circleGeometry = (
      /** @type {import("../geom/Circle.js").default} */
      geometry
    );
    if (segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
      const distanceToCenterSquared = squaredDistance(
        circleGeometry.getCenter(),
        fromUserCoordinate(pointCoordinates)
      );
      const distanceToCircumference = Math.sqrt(distanceToCenterSquared) - circleGeometry.getRadius();
      return distanceToCircumference * distanceToCircumference;
    }
  }
  const coordinate = fromUserCoordinate(pointCoordinates);
  tempSegment$1[0] = fromUserCoordinate(segmentData.segment[0]);
  tempSegment$1[1] = fromUserCoordinate(segmentData.segment[1]);
  return squaredDistanceToSegment(coordinate, tempSegment$1);
}
function closestOnSegmentData(pointCoordinates, segmentData, projection) {
  const geometry = segmentData.geometry;
  if (geometry.getType() === "Circle" && segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
    let circleGeometry = (
      /** @type {import("../geom/Circle.js").default} */
      geometry
    );
    return toUserCoordinate(
      circleGeometry.getClosestPoint(
        fromUserCoordinate(pointCoordinates)
      )
    );
  }
  const coordinate = fromUserCoordinate(pointCoordinates);
  tempSegment$1[0] = fromUserCoordinate(segmentData.segment[0]);
  tempSegment$1[1] = fromUserCoordinate(segmentData.segment[1]);
  return toUserCoordinate(
    closestOnSegment(coordinate, tempSegment$1)
  );
}
function getDefaultStyleFunction() {
  const style = createEditingStyle();
  return function(feature, resolution) {
    return style["Point"];
  };
}
const SnapEventType = {
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
class SnapEvent extends BaseEvent {
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
    this.vertex = options.vertex;
    this.vertexPixel = options.vertexPixel;
    this.feature = options.feature;
    this.segment = options.segment;
  }
}
const GEOMETRY_SEGMENTERS = {
  /**
   * @param {import("../geom/Circle.js").default} geometry Geometry.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {Array<Segment>} Segments
   */
  Circle(geometry, projection) {
    let circleGeometry = geometry;
    const polygon = fromCircle(circleGeometry);
    return GEOMETRY_SEGMENTERS.Polygon(polygon);
  },
  /**
   * @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {Array<Segment>} Segments
   */
  GeometryCollection(geometry, projection) {
    const segments = [];
    const geometries = geometry.getGeometriesArray();
    for (let i = 0; i < geometries.length; ++i) {
      const segmenter = this[geometries[i].getType()];
      if (segmenter) {
        segments.push(segmenter(geometries[i], projection));
      }
    }
    return segments.flat();
  },
  /**
   * @param {import("../geom/LineString.js").default} geometry Geometry.
   * @return {Array<Segment>} Segments
   */
  LineString(geometry) {
    const segments = [];
    const coordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    for (let i = 0, ii = coordinates.length - stride; i < ii; i += stride) {
      segments.push([
        coordinates.slice(i, i + 2),
        coordinates.slice(i + stride, i + stride + 2)
      ]);
    }
    return segments;
  },
  /**
   * @param {import("../geom/MultiLineString.js").default} geometry Geometry.
   * @return {Array<Segment>} Segments
   */
  MultiLineString(geometry) {
    const segments = [];
    const coordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    const ends = geometry.getEnds();
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      for (let j = offset, jj = end - stride; j < jj; j += stride) {
        segments.push([
          coordinates.slice(j, j + 2),
          coordinates.slice(j + stride, j + stride + 2)
        ]);
      }
      offset = end;
    }
    return segments;
  },
  /**
   * @param {import("../geom/MultiPoint.js").default} geometry Geometry.
   * @return {Array<Segment>} Segments
   */
  MultiPoint(geometry) {
    const segments = [];
    const coordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    for (let i = 0, ii = coordinates.length; i < ii; i += stride) {
      segments.push([coordinates.slice(i, i + 2)]);
    }
    return segments;
  },
  /**
   * @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
   * @return {Array<Segment>} Segments
   */
  MultiPolygon(geometry) {
    const segments = [];
    const coordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    const endss = geometry.getEndss();
    let offset = 0;
    for (let i = 0, ii = endss.length; i < ii; ++i) {
      const ends = endss[i];
      for (let j = 0, jj = ends.length; j < jj; ++j) {
        const end = ends[j];
        for (let k = offset, kk = end - stride; k < kk; k += stride) {
          segments.push([
            coordinates.slice(k, k + 2),
            coordinates.slice(k + stride, k + stride + 2)
          ]);
        }
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
    const segments = [];
    const coordinates = geometry.getFlatCoordinates();
    const stride = geometry.getStride();
    const ends = geometry.getEnds();
    let offset = 0;
    for (let i = 0, ii = ends.length; i < ii; ++i) {
      const end = ends[i];
      for (let j = offset, jj = end - stride; j < jj; j += stride) {
        segments.push([
          coordinates.slice(j, j + 2),
          coordinates.slice(j + stride, j + stride + 2)
        ]);
      }
      offset = end;
    }
    return segments;
  }
};
function getFeatureFromEvent(evt) {
  if (
    /** @type {import("../source/Vector.js").VectorSourceEvent} */
    evt.feature
  ) {
    return (
      /** @type {import("../source/Vector.js").VectorSourceEvent} */
      evt.feature
    );
  }
  if (
    /** @type {import("../Collection.js").CollectionEvent<import("../Feature.js").default>} */
    evt.element
  ) {
    return (
      /** @type {import("../Collection.js").CollectionEvent<import("../Feature.js").default>} */
      evt.element
    );
  }
  return null;
}
const tempSegment = [];
const tempExtents = [];
const tempSegmentData = [];
class Snap extends PointerInteraction {
  /**
   * @param {Options} [options] Options.
   */
  constructor(options) {
    options = options ? options : {};
    super({
      handleDownEvent: TRUE,
      stopDown: FALSE
    });
    this.on;
    this.once;
    this.un;
    this.source_ = options.source ? options.source : null;
    this.vertex_ = options.vertex !== void 0 ? options.vertex : true;
    this.edge_ = options.edge !== void 0 ? options.edge : true;
    this.intersection_ = options.intersection !== void 0 ? options.intersection : false;
    this.features_ = options.features ? options.features : null;
    this.featuresListenerKeys_ = [];
    this.featureChangeListenerKeys_ = {};
    this.indexedFeaturesExtents_ = {};
    this.pendingFeatures_ = {};
    this.pixelTolerance_ = options.pixelTolerance !== void 0 ? options.pixelTolerance : 10;
    this.rBush_ = new RBush();
    this.snapped_ = null;
    this.segmenters_ = Object.assign(
      {},
      GEOMETRY_SEGMENTERS,
      options.segmenters
    );
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
        const segments = segmenter.call(
          this.segmenters_,
          geometry,
          this.getMap().getView().getProjection()
        );
        let segmentCount = segments.length;
        for (let i = 0; i < segmentCount; ++i) {
          const segment = segments[i];
          tempExtents[i] = boundingExtent(segment);
          tempSegmentData[i] = {
            feature,
            segment
          };
        }
        if (this.intersection_) {
          for (let j = 0, jj = segments.length; j < jj; ++j) {
            const segment = segments[j];
            if (segment.length === 1) {
              continue;
            }
            const extent = tempExtents[j];
            for (let k = 0, kk = j - 1; k < kk; ++k) {
              const otherSegment = segments[k];
              if (!intersects(extent, tempExtents[k])) {
                continue;
              }
              const intersection = getIntersectionPoint(segment, otherSegment);
              if (!intersection) {
                continue;
              }
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
              if (otherSegment.length === 1) {
                continue;
              }
              const intersection = getIntersectionPoint(segment, otherSegment);
              if (!intersection) {
                continue;
              }
              const intersectionSegment = [intersection];
              tempExtents[segmentCount] = boundingExtent(intersectionSegment);
              tempSegmentData[segmentCount++] = {
                feature,
                intersectionFeature: otherSegments[k].feature,
                segment: intersectionSegment
              };
            }
          }
        }
        if (segmentCount === 1) {
          this.rBush_.insert(tempExtents[0], tempSegmentData[0]);
        } else {
          tempExtents.length = segmentCount;
          tempSegmentData.length = segmentCount;
          this.rBush_.load(tempExtents, tempSegmentData);
        }
      }
    }
    if (register) {
      if (this.featureChangeListenerKeys_[feature_uid]) {
        unlistenByKey(this.featureChangeListenerKeys_[feature_uid]);
      }
      this.featureChangeListenerKeys_[feature_uid] = listen(
        feature,
        EventType.CHANGE,
        this.handleFeatureChange_,
        this
      );
    }
  }
  /**
   * @return {import("../Collection.js").default<import("../Feature.js").default>|Array<import("../Feature.js").default>} Features.
   * @private
   */
  getFeatures_() {
    let features;
    if (this.features_) {
      features = this.features_;
    } else if (this.source_) {
      features = this.source_.getFeatures();
    }
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
      if (this.snapped_ && !this.areSnapDataEqual_(this.snapped_, result)) {
        this.dispatchEvent(new SnapEvent(SnapEventType.UNSNAP, this.snapped_));
      }
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
    if (feature) {
      this.addFeature(feature);
    }
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
    const feature = (
      /** @type {import("../Feature.js").default} */
      evt.target
    );
    if (this.handlingDownUpSequence) {
      this.pendingFeatures_[getUid(feature)] = feature;
    } else {
      this.updateFeature_(feature);
    }
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
      for (const feature of featuresToUpdate) {
        this.updateFeature_(feature);
      }
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
        if (feature === node.feature || feature === node.intersectionFeature) {
          rBush.remove(node);
        }
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
    if (!Array.isArray(features)) {
      features = features.getArray();
    }
    if (currentMap) {
      keys.forEach(unlistenByKey);
      keys.length = 0;
      this.rBush_.clear();
      Object.values(this.featureChangeListenerKeys_).forEach(unlistenByKey);
      this.featureChangeListenerKeys_ = {};
    }
    super.setMap(map);
    if (map) {
      if (this.features_) {
        keys.push(
          listen(
            this.features_,
            CollectionEventType.ADD,
            this.handleFeatureAdd_,
            this
          ),
          listen(
            this.features_,
            CollectionEventType.REMOVE,
            this.handleFeatureRemove_,
            this
          )
        );
      } else if (this.source_) {
        keys.push(
          listen(
            this.source_,
            VectorEventType.ADDFEATURE,
            this.handleFeatureAdd_,
            this
          ),
          listen(
            this.source_,
            VectorEventType.REMOVEFEATURE,
            this.handleFeatureRemove_,
            this
          )
        );
      }
      for (const feature of features) {
        this.addFeature(feature);
      }
    }
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel
   * @param {import("../coordinate.js").Coordinate} pixelCoordinate Coordinate
   * @param {import("../Map.js").default} map Map.
   * @return {SnappedInfo|null} Snap result
   */
  snapTo(pixel, pixelCoordinate, map) {
    map.getView().getProjection();
    const projectedCoordinate = fromUserCoordinate(pixelCoordinate);
    const box = toUserExtent(
      buffer(
        boundingExtent([projectedCoordinate]),
        map.getView().getResolution() * this.pixelTolerance_
      )
    );
    const segments = this.rBush_.getInExtent(box);
    const segmentsLength = segments.length;
    if (segmentsLength === 0) {
      return null;
    }
    let closestVertex;
    let minSquaredDistance = Infinity;
    let closestFeature;
    let closestSegment = null;
    const squaredPixelTolerance = this.pixelTolerance_ * this.pixelTolerance_;
    const getResult = () => {
      if (!closestVertex) {
        return null;
      }
      const vertexPixel = map.getPixelFromCoordinate(closestVertex);
      const squaredPixelDistance = squaredDistance(pixel, vertexPixel);
      if (squaredPixelDistance > squaredPixelTolerance) {
        return null;
      }
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
        if (segmentData.feature.getGeometry().getType() !== "Circle") {
          for (const vertex of segmentData.segment) {
            const tempVertexCoord = fromUserCoordinate(vertex);
            const delta = squaredDistance(projectedCoordinate, tempVertexCoord);
            if (delta < minSquaredDistance && (this.intersection_ && segmentData.intersectionFeature || this.vertex_ && !segmentData.intersectionFeature)) {
              closestVertex = vertex;
              minSquaredDistance = delta;
              closestFeature = segmentData.feature;
            }
          }
        }
      }
      const result = getResult();
      if (result) {
        return result;
      }
    }
    if (this.edge_) {
      for (let i = 0; i < segmentsLength; ++i) {
        let vertex = null;
        const segmentData = segments[i];
        if (segmentData.feature.getGeometry().getType() === "Circle") {
          let circleGeometry = segmentData.feature.getGeometry();
          vertex = closestOnCircle(
            projectedCoordinate,
            /** @type {import("../geom/Circle.js").default} */
            circleGeometry
          );
        } else {
          const [segmentStart, segmentEnd] = segmentData.segment;
          if (segmentEnd) {
            tempSegment[0] = fromUserCoordinate(segmentStart);
            tempSegment[1] = fromUserCoordinate(segmentEnd);
            vertex = closestOnSegment(projectedCoordinate, tempSegment);
          }
        }
        if (vertex) {
          const delta = squaredDistance(projectedCoordinate, vertex);
          if (delta < minSquaredDistance) {
            closestVertex = toUserCoordinate(vertex);
            closestSegment = segmentData.feature.getGeometry().getType() === "Circle" ? null : segmentData.segment;
            minSquaredDistance = delta;
            closestFeature = segmentData.feature;
          }
        }
      }
      const result = getResult();
      if (result) {
        return result;
      }
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
}
const condition = (testFn) => {
  return (_mapBrowserEvent) => {
    return testFn();
  };
};
const conditionThen = (condition2, callback) => {
  return (mapBrowserEvent) => {
    if (condition2(mapBrowserEvent)) {
      callback(mapBrowserEvent);
      return true;
    }
    return false;
  };
};
class ListenKey {
  /**
   * @param listenedKey the key to listen.
   */
  constructor(listenedKey) {
    this.listenedKey = listenedKey;
    this.eventKeys.push(
      listen(document, "keydown", this.handleKeyDown.bind(this)),
      listen(document, "keyup", this.handleKeyUp.bind(this))
    );
  }
  eventKeys = [];
  keyDown = false;
  keyDownCallback;
  keyUpCallback;
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
      if (this.keyDownCallback) {
        this.keyDownCallback();
      }
    }
  }
  /**
   * Check if the key is released.
   * @private
   */
  handleKeyUp(evt) {
    if (evt instanceof KeyboardEvent && evt.key === this.listenedKey) {
      this.keyDown = false;
      if (this.keyUpCallback) {
        this.keyUpCallback();
      }
    }
  }
}
const updateLayerStyle = (layer, styleFn) => {
  if (layer.get("draw-style-set")) {
    return;
  }
  layer.setStyle(styleFn);
  layer.set("draw-style-set", true);
};
const EmptyStyle = new Style();
const layer1Id = "layer1-id";
const backgroundLayer1Id = "background1-id";
const pointInteractionId = "point-interaction-uid";
const lineInteractionId = "line-interaction-uid";
const modifyInteractionId = "modify-interaction-uid";
const mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(
  new View({
    center: [0, 0],
    zoom: 2
  })
);
mapEntry.getOlcMap().getMap().setTarget("map");
const print = (msg) => {
  document.querySelector("#console .text").textContent = msg;
};
const layer1 = new VectorLayer({
  source: new VectorSource({
    features: new Collection([new Feature()])
  })
});
const backgroundLayer1 = new TileLayer({
  source: new OSM()
});
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
let drawPoint;
let drawLine;
let modify;
let translate;
let snap;
let listenKey;
const eventKeys = [];
const setupDrawing = () => {
  const drawLayer = mapEntry.getOlcOverlayLayer().getLayer(layer1Id);
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
    // Use "overEvery" or "overSome" or a custom function to chain conditions.
    deleteCondition: conditionThen(
      overEvery([click, condition(() => listenKey.isKeyDown())]),
      delayOnDeleteAction.bind(void 0)
    )
  });
  mapEntry.getOlcModifyInteractionGroup().add(modifyInteractionId, modify);
  translate = new Translate({
    layers: [drawLayer],
    condition: platformModifierKeyOnly
  });
  mapEntry.getOlcModifyInteractionGroup().add("translate", translate);
  snap = new Snap({
    source
  });
  mapEntry.getOlcModifyInteractionGroup().add("snap", snap);
  eventKeys.push(
    mapEntry.getOlcDrawInteractionGroup().find(pointInteractionId)?.on("drawend", () => {
      print(`Point added.`);
    }),
    mapEntry.getOlcDrawInteractionGroup().find(lineInteractionId)?.on("drawend", () => {
      print(`Line added.`);
    })
  );
};
const createStyle = (feature) => {
  const geometry = feature?.getGeometry();
  const type = geometry?.getType();
  if (["MultiPoint", "Point"].includes(`${type}`) && geometry) {
    const xCoordinate = geometry.getCoordinates()[0] ?? 0;
    const color = Math.round(Math.abs(xCoordinate) / (20037508 / 2) * 255);
    return new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({
          color: `rgba(${color}, 0, 0, 0.7)`
        }),
        stroke: new Stroke({
          color: `rgba(${color}, 0, 0, 0.7)`
        })
      })
    });
  } else if (["LineString", "MultiLineString"].includes(`${type}`) && geometry) {
    return new Style({
      stroke: new Stroke({
        color: "rgba(200, 150, 0, 0.8)",
        width: 4
      })
    });
  } else {
    return EmptyStyle;
  }
};
const delayOnDeleteAction = (mapBrowserEvent) => {
  setTimeout(() => onDeleteAction(mapBrowserEvent), 20);
};
const onDeleteAction = (mapBrowserEvent) => {
  const overlayLayerGroup = mapEntry.getOlcOverlayLayer();
  mapBrowserEvent.map.forEachFeatureAtPixel(
    mapBrowserEvent.pixel,
    (feature) => {
      if (!overlayLayerGroup || feature instanceof RenderFeature) {
        return;
      }
      const geometry = feature.getGeometry();
      if (!geometry || geometry.getType() === "LineString" && geometry.getCoordinates().length > 2) {
        return;
      }
      const features = overlayLayerGroup.getFeaturesCollection(layer1Id)?.getArray() || [];
      if (features.includes(feature)) {
        overlayLayerGroup.removeFeatures(layer1Id, [feature]);
        const modify2 = mapEntry.getOlcModifyInteractionGroup().find(modifyInteractionId);
        modify2?.setActive(false);
        modify2?.setActive(true);
      }
    }
  );
};
setupDrawing();
mapEntry.getOlcDrawInteractionGroup().setActive(true, pointInteractionId);
const typeSelect = document.getElementById("type");
typeSelect.addEventListener("change", (evt) => {
  if (evt.target.value === "point") {
    mapEntry.getOlcDrawInteractionGroup().setActive(true, pointInteractionId);
  } else {
    mapEntry.getOlcDrawInteractionGroup().setActive(true, lineInteractionId);
  }
});
