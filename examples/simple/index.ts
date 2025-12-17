import OlLayerTile from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import OlLayerVector from 'ol/layer/Vector.js';
import OlSourceVector from 'ol/source/Vector.js';
import OlCollection from 'ol/Collection.js';
import OlFeature from 'ol/Feature.js';
import OlGeomPolygon from 'ol/geom/Polygon.js';
import { BackgroundLayerGroup } from '../../src/layer/background-layer-group.js';
import { Map } from '../../src/map/map.js';
import { OverlayLayerGroup } from '../../src/layer/overlay-layer-group.js';
import OlView from 'ol/View.js';

// Setup example.
const backgroundLayer = new OlLayerTile({
  source: new OSM(),
});
const overlayLayer = new OlLayerVector({
  source: new OlSourceVector({
    features: new OlCollection([
      new OlFeature({
        geometry: new OlGeomPolygon([
          [
            [0, 0],
            [500000, 1000000],
            [1000000, 0],
            [0, 0],
          ],
        ]),
      }),
    ]),
  }),
});
const view = new OlView({
  center: [0, 0],
  zoom: 2,
});

// Globally accessible values you need:
const backgroundLayerId = 'background1-id';
const overlayLayerId = 'overlay1-id';
const olcMap = new Map(Map.createEmptyMap());
const backgroundLayerGroup = new BackgroundLayerGroup(olcMap.getMap());
const overlayLayerGroup = new OverlayLayerGroup(olcMap.getMap());

// Below: Use ol-comfy.
// One of your controller initializing the map and inserting the layers.
olcMap.getMap().setTarget('map');
olcMap.getMap().setView(view);
backgroundLayerGroup.addLayer(backgroundLayer, backgroundLayerId);
overlayLayerGroup.addLayer(overlayLayer, overlayLayerId);

// Then, no matter where you are in your code, you can access the map with:
olcMap.getMap();
// The layer, or layer group functionalities with:
backgroundLayerGroup.getLayer(backgroundLayerId);
// Or
overlayLayerGroup.getLayer(overlayLayerId);
// And you can be sure that you can find you layer back, and that
// the background layer is not above the overlay layers.
