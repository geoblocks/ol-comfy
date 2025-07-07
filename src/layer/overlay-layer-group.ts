import has from 'lodash/has.js';
import { Subject } from 'rxjs';
import OlMap from 'ol/Map.js';
import { LayerGroup, type LayerGroupOptions } from './layer-group.js';
import { LayerUidKey } from './property-key.js';
import {
  createEmpty as olCreateEmptyExtent,
  extend as olExtend,
  type Extent as OlExtent,
  isEmpty as olIsEmpty,
} from 'ol/extent.js';
import OlFeature from 'ol/Feature.js';
import OlLayerVector from 'ol/layer/Vector.js';
import OlSourceVector from 'ol/source/Vector.js';
import { Geometry as OlGeometry } from 'ol/geom.js';
import OlCollection from 'ol/Collection.js';
import OlSourceCluster from 'ol/source/Cluster.js';
import { getFeaturesExtent } from '../feature/utils.js';

export const DefaultOverlayLayerGroupName = 'olcOverlayLayerGroup';

/**
 * Feature selected event definition.
 */
export interface FeatureSelected {
  [LayerUidKey]: string;
  selected: OlFeature<OlGeometry>[];
  deselected: OlFeature<OlGeometry>[];
}

/**
 * Event definition for change in feature property
 */
export interface FeaturePropertyChanged {
  [LayerUidKey]: string;
  propertyKey: string;
}

/**
 * LayerGroup specialized to manage layers with features (mostly vector layers).
 * Each instance must have a unique name (the default name will be valid for the first group).
 * The default position is 20.
 */
export class OverlayLayerGroup extends LayerGroup {
  readonly featuresSelected: Subject<FeatureSelected>;
  readonly featuresPropertyChanged: Subject<FeaturePropertyChanged>;

  constructor(map: OlMap, options: LayerGroupOptions = {}) {
    const layerGroupUid = options[LayerUidKey] || DefaultOverlayLayerGroupName;
    super(map);
    const position = options.position ?? 20;
    this.addLayerGroup(layerGroupUid, position);
    this.featuresSelected = new Subject<FeatureSelected>();
    this.featuresPropertyChanged = new Subject<FeaturePropertyChanged>();
  }

  /**
   * Get the vector layer if a vector layer with this layer id exists.
   * @param layerUid the id of the layer to add features into.
   */
  getVectorLayer(layerUid: string): OlLayerVector<OlSourceVector> | null {
    const layer = super.getLayer(layerUid);
    return layer instanceof OlLayerVector ? layer : null;
  }

  /**
   * @param layerUid the id of the layer to add features into.
   * @returns the vector source in the corresponding layer or null. For
   *     cluster source, the returned source is the first source (the
   *     effective cluster source, and not the vector source inside the
   *     cluster source).
   */
  getVectorSource(layerUid: string): OlSourceVector<OlFeature> | null {
    const layer = this.getVectorLayer(layerUid);
    if (layer === null) {
      return null;
    }
    return layer.getSource();
  }

  /**
   * @param layerUid the id of the layer to add features into.
   * @returns the last vector source in the corresponding layer or null.
   * Meaning the normal source on the vector layer with VectorSource, and the
   * vector source inside the cluster source for ClusterSource.
   */
  getEndVectorSource(layerUid: string): OlSourceVector<OlFeature> | null {
    const source = this.getVectorSource(layerUid);
    // Returns the vector source from a cluster source if it exists. And from
    // the vector source directly otherwise.
    if (has(source, 'source')) {
      return (source as unknown as OlSourceCluster).getSource();
    }
    return source;
  }

  /**
   * Add features in the target overlay layer. Does
   * nothing with an empty array.
   * @param layerUid the id of the layer to add features into.
   * @param features the features to add to the layer.
   */
  addFeatures(layerUid: string, features: OlFeature<OlGeometry>[]) {
    const source = this.getEndVectorSource(layerUid);
    if (!source || !features.length) {
      return;
    }
    // Avoid already exists errors.
    this.removeFeatures(layerUid, features);
    source.addFeatures(features);
  }

  /**
   * Remove features from the target overlay layer. Does
   * nothing with an empty array.
   * @param layerUid the id of the layer to remove features from.
   * @param features the features to remove to the layer.
   */
  removeFeatures(layerUid: string, features: OlFeature<OlGeometry>[]) {
    const source = this.getEndVectorSource(layerUid);
    if (!source || !features.length) {
      return;
    }
    features.forEach((feature) => {
      if (source.hasFeature(feature)) {
        source.removeFeature(feature);
      }
    });
  }

  /**
   * Set features in the target overlay layer.
   * @param layerUid the id of the layer to remove features from.
   * @param features the features to replace existing ones in the layer.
   */
  setFeatures(layerUid: string, features: OlFeature<OlGeometry>[]) {
    const source = this.getEndVectorSource(layerUid);
    if (!source) {
      return;
    }
    source.clear();
    source.addFeatures(features);
  }

  /**
   * @param layerUid the id of the layer to get the extent from.
   * @returns The extent (not empty) of all features in the target layer or
   *   null.
   */
  getLayerFeaturesExtent(layerUid: string): OlExtent | null {
    return getFeaturesExtent(this.getFeaturesCollection(layerUid)?.getArray() || []);
  }

  /**
   * @returns The extent (not empty) of all features in every overlay in the
   * map.
   */
  getFeaturesExtent(): OlExtent | null {
    const extent = this.layerGroup
      .getLayers()
      .getArray()
      .reduce(
        (currentExtent, layer) =>
          olExtend(
            currentExtent,
            this.getLayerFeaturesExtent(layer.get(LayerUidKey)) ?? [],
          ),
        olCreateEmptyExtent(),
      );
    return extent && !olIsEmpty(extent) ? extent : null;
  }

  /**
   * @param layerUid id of the layer.
   * @returns The collections of features in the layer or null. Do not use
   * a collection to add/remove features. It's slow. Use related methods on the
   * source directly.
   */
  getFeaturesCollection(layerUid: string): OlCollection<OlFeature<OlGeometry>> | null {
    const source = this.getEndVectorSource(layerUid);
    return source?.getFeaturesCollection() || null;
  }

  /**
   * Emit a select feature event.
   */
  emitSelectFeatures(
    layerUid: string,
    selected: OlFeature<OlGeometry>[],
    deselected: OlFeature<OlGeometry>[],
  ) {
    this.featuresSelected.next({
      [LayerUidKey]: layerUid,
      selected,
      deselected,
    });
  }

  /**
   * Set a property of every given feature with the same value.
   */
  setFeaturesProperty(
    layerUid: string,
    features: OlFeature<OlGeometry>[],
    key: string,
    value: unknown,
  ) {
    features.forEach((feature) => {
      feature.set(key, value, true);
    });
    this.getLayer(layerUid)?.changed();
    this.featuresPropertyChanged.next({
      [LayerUidKey]: layerUid,
      propertyKey: key,
    });
  }

  /**
   * @param layerUid id of the layer
   * @returns The cluster features in the layer or null
   * Do not modify or save cluster features as they are recreated dynamically
   * on each map rendering (move, zoom, etc.). It's not possible to rely on
   *     this object.
   */
  getClusterFeatures(layerUid: string): OlFeature<OlGeometry>[] | null {
    const source = this.getVectorSource(layerUid);
    return source ? source.getFeatures() : null;
  }
}
