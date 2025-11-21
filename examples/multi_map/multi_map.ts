import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import storeManager from './store-manager.js';
import OlControlZoom from 'ol/control/Zoom.js';
import { BackgroundLayerGroup } from '../../src/layer/background-layer-group.js';
import { Map } from '../../src/map/map.js';

// Globally accessible values you need:
const storesId1 = 'store-1';
const storesId2 = 'store-2';
const backgroundLayer1Id = 'background1-id';
const backgroundLayer2Id = 'background2-id';

// Setup example.
const backgroundLayer1 = new OlLayerTile({
  source: new OSM(),
});
const backgroundLayer2 = new OlLayerTile({
  source: new OSM(),
});
const view1 = new OlView({
  center: [0, 0],
  zoom: 5,
});
const view2 = new OlView({
  center: [0, 0],
  zoom: 2,
});

// Below: Use ol-comfy.
// Your controller initializing multiple map.
const map1 = storeManager.getMapStore(storesId1);
map1.setTarget('map1');
map1.setView(view1);
let backgroundLayerGroup = new BackgroundLayerGroup(map1);
backgroundLayerGroup.addLayer(backgroundLayer1, backgroundLayer1Id);
let map2 = storeManager.getMapStore(storesId2);
map2.setTarget('map2');
map2.setView(view2);
backgroundLayerGroup = new BackgroundLayerGroup(map2);
backgroundLayerGroup.addLayer(backgroundLayer2, backgroundLayer2Id);

// A component adding a control on one map.
map2 = storeManager.getMapStore(storesId2);
const olcMap = new Map(map2);
olcMap.addControl('zoom-control', new OlControlZoom());
