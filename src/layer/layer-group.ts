import OlMap from 'ol/Map.js';
import OlCollection from 'ol/Collection.js';
import OlLayerGroup from 'ol/layer/Group.js';
import OlLayerBase from 'ol/layer/Base.js';
import OlLayerLayer from 'ol/layer/Layer.js';
import OlSourceSource from 'ol/source/Source.js';
import type { ViewStateLayerStateExtent } from 'ol/View.js';
import { insertAtKeepOrder } from '../collection.js';
import { isNil, uniq } from '../utils.js';
import BaseEvent from 'ol/events/Event.js';
import Observable from 'ol/Observable.js';
import type { EventsKey } from 'ol/events.js';

/** Property key in a layer to identify the layer; expected matching value: string */
export const LayerUidKey = 'olcLayerUid';

const LayerPropertyChangedEventType = 'olcLayerPropertyChanged';
const LayerAffectedEventType = 'olcLayerAffected';

/**
 * To provide changed-like-event, without touching the original layer.
 * With source layer uid and free reason why/by/for it's fired.
 * Example: fire/listen to silently set layer opacity (as reason) without touching the real
 * layer and having to listen to every layer individually.
 */
export class LayerAffectedEvent extends BaseEvent {
  static readonly type = LayerAffectedEventType;
  readonly [LayerUidKey]: string;
  readonly reason: string;

  constructor(layerUid: string, reason: string) {
    super(LayerAffectedEvent.type);
    this[LayerUidKey] = layerUid;
    this.reason = reason;
  }
}

/**
 * An event to listen on layer property changes in this LayerGroup without the need of having
 * the layer itself.
 */
export class LayerPropertyChangedEvent extends BaseEvent {
  static readonly type = LayerPropertyChangedEventType;
  readonly [LayerUidKey]: string;
  readonly propertyKey: string;

  constructor(layerUid: string, propertyKey: string) {
    super(LayerPropertyChangedEvent.type);
    this[LayerUidKey] = layerUid;
    this.propertyKey = propertyKey;
  }
}

export type LayerGroupLayerAffectedOnSignature = (
  type: typeof LayerAffectedEventType,
  listener: (event: LayerAffectedEvent) => void,
) => EventsKey;

export type LayerPropertyChangedOnSignature = (
  type: typeof LayerPropertyChangedEventType,
  listener: (event: LayerPropertyChangedEvent) => void,
) => EventsKey;

export type LayerGroupOnSignature = LayerGroupLayerAffectedOnSignature &
  LayerPropertyChangedOnSignature;

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
  [LayerUidKey]?: string;
}

/**
 * Parent (abstract) class for a layer group. Helps to manipulate one layer group.
 * The child class must start by setting the layerGroup.
 */
export class LayerGroup extends Observable {
  protected readonly map: OlMap;
  // @ts-expect-error this will be handled by the child classes
  protected layerGroup: OlLayerGroup;
  // @ts-expect-error right types looks not possible to handle here.
  override readonly once: LayerGroupOnSignature;
  // @ts-expect-error right types looks not possible to handle here.
  override readonly on: LayerGroupOnSignature;

  constructor(map: OlMap) {
    super();
    // @ts-expect-error right types looks not possible to handle here.
    this.once = this.onceInternal;
    // @ts-expect-error right types looks not possible to handle here.
    this.on = this.onceInternal;
    this.un = this.unInternal;
    this.map = map;
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
        .find((layer) => layer.get(LayerUidKey) === layerUid) || null
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
   * Fires an "affected" layer event.
   */
  notifyLayerAffected(layerUid: string, reason: string) {
    if (this.hasListener(LayerAffectedEvent.type)) {
      this.dispatchEvent(new LayerAffectedEvent(layerUid, reason));
    }
  }

  /**
   * Fires a "LayerPropertyChanged" and call a "changed" event on the matching OL layer.
   */
  notifyLayerPropertyChanged(layerUid: string, propertyKey: string) {
    this.getLayer(layerUid)?.changed();
    if (this.hasListener(LayerPropertyChangedEvent.type)) {
      this.dispatchEvent(new LayerPropertyChangedEvent(layerUid, propertyKey));
    }
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
    layer.set(LayerUidKey, layerUid);
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
        [LayerUidKey]: layerGroupUid,
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
            layerGroup.get(LayerUidKey) === layerUid &&
            layerGroup instanceof OlLayerGroup,
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
