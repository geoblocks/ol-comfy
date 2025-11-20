import OlMap from 'ol/Map.js';
import OlLayerBase from 'ol/layer/Base.js';
import { LayerGroup, type LayerGroupOptions } from './layer-group.js';
import { getOlcUid } from '../uid.js';

export const DefaultLayerBGGroupUid = 'olcBackgroundLayerGroupUid';

/**
 * LayerGroup specialized to manage background layers (mostly tiled layers).
 * Each instance must have a unique name (The default name will be valid for the first group).
 * The default position is 0.
 */
export class BackgroundLayerGroup extends LayerGroup {
  constructor(map: OlMap, options: LayerGroupOptions = {}) {
    const layerGroupUid = options.groupUid ?? DefaultLayerBGGroupUid;
    super(map);
    const position = options.position ?? 0;
    this.addLayerGroup(layerGroupUid, position);
  }

  /**
   * @returns the first visible layer, or null if none is visible.
   */
  getFirstVisible(): OlLayerBase | null {
    return (
      this.layerGroup
        .getLayers()
        .getArray()
        .find((layer) => layer.getVisible()) ?? null
    );
  }

  /**
   * Set one background layer as visible, all others as not visible.
   */
  toggleVisible(layerUid: string) {
    const layers = this.layerGroup.getLayers().getArray();
    const foundLayer = layers.find((layer) => getOlcUid(layer) === layerUid);
    layers.forEach((layer) => {
      layer.setVisible(layer === foundLayer);
    });
  }
}
