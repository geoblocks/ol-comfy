import OlMap from 'ol/Map.js';
import { LayerGroup, type LayerGroupOptions, LayerUidKey } from './layer-group.js';

export const DefaultLayerBGGroupUid = 'olcBackgroundLayerGroupUid';

/**
 * LayerGroup specialized to manage background layers (mostly tiled layers).
 * Each instance must have a unique name (The default name will be valid for the first group).
 * The default position is 0.
 */
export class BackgroundLayerGroup extends LayerGroup {
  constructor(map: OlMap, options: LayerGroupOptions = {}) {
    const layerGroupUid = options[LayerUidKey] ?? DefaultLayerBGGroupUid;
    super(map);
    const position = options.position ?? 0;
    this.addLayerGroup(layerGroupUid, position);
  }

  /**
   * Set one background layer as visible, all others as not visible
   */
  toggleVisible(layerUid: string) {
    const layers = this.layerGroup.getLayers().getArray();
    const foundLayer = layers.find((layer) => layer.get(LayerUidKey) === layerUid);
    layers.forEach((layer) => {
      layer.setVisible(layer === foundLayer);
    });
  }
}
