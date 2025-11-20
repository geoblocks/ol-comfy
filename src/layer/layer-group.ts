import OlMap from 'ol/Map.js';
import OlCollection from 'ol/Collection.js';
import OlLayerGroup from 'ol/layer/Group.js';
import OlLayerBase from 'ol/layer/Base.js';
import OlLayerLayer from 'ol/layer/Layer.js';
import OlSourceSource from 'ol/source/Source.js';
import type { ViewStateLayerStateExtent } from 'ol/View.js';
import { insertAtKeepOrder } from '../collection.js';
import { isNil, uniq } from '../utils.js';
import { Subject } from 'rxjs';
import { getOlcUid, olcUidKey } from '../uid.js';

/**
 * Event definition for "affected" event of a layer in the layerGroup.
 */
export interface LayerAffected {
  [olcUidKey]: string;
  reason: string;
}

/**
 * Event definition for property change in a layer of this layerGroup.
 */
export interface LayerPropertyChanged {
  [olcUidKey]: string;
  propertyKey: string;
}

/**
 * Options to create a layer group.
 */
export interface LayerGroupOptions {
  /**
   * Position of the layer group in the map layer array. This position is
   * fixed.
   */
  position?: number;
  /** Unique ID for the layer group. */
  [olcUidKey]?: string;
}

/**
 * Parent (abstract) class for a layer group. Helps to manipulate one layer group.
 * The child class must start by setting the layerGroup.
 */
export class LayerGroup {
  protected readonly map: OlMap;
  // @ts-expect-error this will be handled by the child classes
  protected layerGroup: OlLayerGroup;
  /**
   * To provide changed-like-event, without touching the original layer.
   * With source layer uid and free reason why/by/for it's emitted.
   * Example: emit/listen to silently set layer opacity (as reason) without touching the real
   * layer and having to listen to every layer individually.
   */
  readonly layerAffected: Subject<LayerAffected>;
  /**
   * Event to observe layer property change in this LayerGroup without the need of having
   * the layer itself.
   */
  readonly layerPropertyChanged: Subject<LayerPropertyChanged>;

  constructor(map: OlMap) {
    this.map = map;
    this.layerAffected = new Subject<LayerAffected>();
    this.layerPropertyChanged = new Subject<LayerPropertyChanged>();
  }

  /**
   * @returns the layer group of this instance.
   */
  getLayerGroup(): OlLayerGroup {
    return this.layerGroup;
  }

  /**
   * Remove all layers from the map and clear the layer group.
   */
  clearAll() {
    this.layerGroup
      .getLayers()
      .getArray()
      .slice()
      .forEach((layer) => this.map.removeLayer(layer));
    this.layerGroup.setLayers(new OlCollection());
  }

  /**
   * Add a single layer at the end of the layer group.
   * @param layer Ol layer.
   * @param layerUid id of the layer.
   */
  addLayer(layer: OlLayerBase, layerUid: string) {
    if (!this.setupAddLayer(layer, layerUid)) {
      return;
    }
    this.layerGroup.getLayers().push(layer);
  }

  /**
   * Retrieve a layer currently in the layer group.
   * @returns The matching layer or null.
   */
  getLayer(layerUid: string): OlLayerBase | null {
    return (
      this.layerGroup
        .getLayers()
        .getArray()
        .find((layer) => getOlcUid(layer) === layerUid) || null
    );
  }

  /**
   * @returns The attribution of all visible layers.
   */
  getAttributions(): string[] {
    const attributions = this.layerGroup
      .getLayers()
      .getArray()
      .filter((layer) => layer.getVisible())
      .flatMap((layer) =>
        this.getAttributionFromLayer(layer as OlLayerLayer<OlSourceSource>),
      );
    return uniq(attributions);
  }

  /**
   * Refresh the source of every layer with a source in the layer group.
   */
  refreshSource() {
    this.getAllSources().forEach((source) => source.refresh());
  }

  /**
   * @returns Every source from layers having sources in the layer group.
   */
  getAllSources(): OlSourceSource[] {
    return this.layerGroup
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('source'))
      .map((layer) => layer.get('source'))
      .filter((source) => !isNil(source));
  }

  /**
   * Set a property of a layer and emit a "LayerPropertyChanged" event if the value has changed.
   */
  setLayerProperty(layerUid: string, propertyKey: string, value: unknown) {
    const layer = this.getLayer(layerUid);
    if (!layer || layer?.get(propertyKey) === value) {
      return;
    }
    layer.set(propertyKey, value);
    this.emitLayerPropertyChanged(layerUid, propertyKey);
  }

  /**
   * Emit an "affected" layer event.
   */
  emitLayerAffected(layerUid: string, reason: string) {
    this.layerAffected.next({
      [olcUidKey]: layerUid,
      reason,
    });
  }

  /**
   * Emits a "LayerPropertyChanged" and call a "changed" event on the matching OL layer.
   */
  emitLayerPropertyChanged(layerUid: string, propertyKey: string) {
    this.getLayer(layerUid)?.changed();
    this.layerPropertyChanged.next({
      [olcUidKey]: layerUid,
      propertyKey,
    });
  }

  /**
   * Provides checks on a layer to know if the layer can be added to the map
   * and set an id for it.
   * @returns true if the layer is valid and can be added. False otherwise.
   * @protected
   */
  protected setupAddLayer(layer: OlLayerBase, layerUid: string): boolean {
    if (isNil(layerUid) || isNil(layer) || layerUid.length === 0) {
      let error = `Unable to add layer ${layerUid || '<empty>'}.`;
      if (isNil(layer)) {
        error = `${error} The layer is not defined.`;
      }
      console.error(error);
      return false;
    }
    if (this.getLayer(layerUid)) {
      return false;
    }
    layer.set(olcUidKey, layerUid);
    return true;
  }

  /**
   * Add a layer group to a specified position in the array of a map's
   * layers.
   * @protected
   */
  protected addLayerGroup(layerGroupUid: string, position: number) {
    const layerGroup = this.findLayerGroup(layerGroupUid);
    if (layerGroup) {
      this.layerGroup = layerGroup;
      return;
    }
    this.layerGroup = new OlLayerGroup({
      properties: {
        [olcUidKey]: layerGroupUid,
      },
    });
    insertAtKeepOrder(
      this.map.getLayers(),
      this.layerGroup,
      `olcPosition-${layerGroupUid}`,
      position,
    );
  }

  /**
   * Retrieve a layer group based on its unique id.
   */
  protected findLayerGroup(layerUid: string): OlLayerGroup | null {
    return (
      (this.map
        .getLayers()
        .getArray()
        .find(
          (layerGroup) =>
            layerGroup.get(olcUidKey) === layerUid && layerGroup instanceof OlLayerGroup,
        ) as OlLayerGroup) || null
    );
  }

  /**
   * @param layer The layer to extract the attributions from.
   * @returns An array of attributions.
   * @private
   */
  private getAttributionFromLayer(layer: OlLayerLayer<OlSourceSource>): string[] {
    const attributionsFn = layer.getSource()?.getAttributions();
    // Small hack to get the attribution without needed an Ol/control see
    // https://github.com/openlayers/openlayers/blob/29dcdeee5570fcfd8151768fcc9a493d8fda5164/src/ol/source/Source.js#L224-L241
    const attributions = attributionsFn
      ? attributionsFn({} as unknown as ViewStateLayerStateExtent)
      : [];
    return Array.isArray(attributions) ? attributions : [attributions];
  }
}
