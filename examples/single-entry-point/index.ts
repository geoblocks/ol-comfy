import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import OlControlZoom from 'ol/control/Zoom.js';
import storeManager from '../store-manager.js';

// Setup example.
const backgroundLayer1 = new OlLayerTile({
  source: new OSM(),
});
const backgroundLayer2 = new OlLayerTile({
  source: new OSM(),
  visible: false,
});
const view1 = new OlView({
  center: [0, 0],
  zoom: 5,
});
const view2 = new OlView({
  center: [0, 0],
  zoom: 2,
});

// Globally accessible values you need:
const storesId1 = 'store-1';
const storesId2 = 'store-2';
const backgroundLayer1Id = 'background1-id';
const backgroundLayer2Id = 'background2-id';
// And also the "storeManager" from ol-comfy/example/store-manager.ts.

// Below: Use ol-comfy.
// No matter where you are in your code, you can instance and access the map-related stuff with:
// Init map 1
const mapEntry1 = storeManager.getMapEntry(storesId1);
mapEntry1.getOlcMap().getMap().setTarget('map1');
mapEntry1.getOlcMap().getMap().setView(view1);
mapEntry1.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
// Init map 2
let mapEntry2 = storeManager.getMapEntry(storesId2);
mapEntry2.getOlcMap().getMap().setTarget('map2');
mapEntry2.getOlcMap().getMap().setView(view2);
mapEntry2.getOlcBackgroundLayer().addLayer(backgroundLayer2, backgroundLayer2Id);
// A component adding a control on one map.
mapEntry2 = storeManager.getMapEntry(storesId2);
mapEntry2.getOlcMap().addControl('zoom-control', new OlControlZoom());
// Activate (only) one backgroun layer
mapEntry2.getOlcBackgroundLayer().toggleVisible(backgroundLayer2Id);
// And add, find another layer, interaction, overlay, etc.
