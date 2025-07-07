import OlMap from 'ol/Map.js';
import { LayerGroup, type LayerGroupOptions } from './layer-group.js';
import { LayerUidKey } from './property-key.js';

export const DefaultLayerBGGroupName = 'olcBackgroundLayerGroup';

/**
 * LayerGroup specialized to manage background layers (mostly tiled layers).
 * Each instance must have a unique name (The default name will be valid for the first group).
 * The default position is 0.
 */
export class BackgroundLayerGroup extends LayerGroup {
  constructor(map: OlMap, options: LayerGroupOptions = {}) {
    const layerGroupUid = options[LayerUidKey] || DefaultLayerBGGroupName;
    super(map, layerGroupUid);
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
