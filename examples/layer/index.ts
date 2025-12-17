import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import OlLayerVector from 'ol/layer/Vector.js';
import OlSourceVector from 'ol/source/Vector.js';
import OlCollection from 'ol/Collection.js';
import OlFeature from 'ol/Feature.js';
import OlGeomPoint from 'ol/geom/Point.js';
import { OSM } from 'ol/source.js';
import { Map } from '../../src/map/map.js';
import { BackgroundLayerGroup } from '../../src/layer/background-layer-group.js';
import {
  OverlayLayerGroup,
  FeaturePropertyChangedEventType,
} from '../../src/layer/overlay-layer-group.js';
import { olcUidKey } from '../../src/uid.js';
import storeManager from '../store-manager.js';

// Setup example.
const print = (msg: string) => {
  document.querySelector('#console .text')!.textContent = msg;
};

// Globally accessible values you need:
const layer1Id = 'layer1-id';
const backgroundLayer1Id = 'background1-id';

// A file initializing the map using the storeManager and the mapEntry.
const mapEntry = storeManager.getMapEntry();
mapEntry
  .getOlcMap()
  .getMap()
  .setView(
    new OlView({
      center: [0, 0],
      zoom: 2,
    }),
  );
mapEntry.getOlcMap().getMap().setTarget('map');

// Below: Use ol-comfy and the example's mapEntry.
// A file adding layers.
const layer1 = new OlLayerVector({
  source: new OlSourceVector({
    features: new OlCollection([
      new OlFeature({
        geometry: new OlGeomPoint([0, 0]),
      }),
    ]),
  }),
});
const backgroundLayer1 = new OlLayerTile({
  source: new OSM(),
});
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);

// Another file wanting to know changes on features for a specific layer.
mapEntry
  .getOlcOverlayLayer()
  .on(FeaturePropertyChangedEventType, (featurePropertyChanged) => {
    const layer = featurePropertyChanged[olcUidKey];
    const key = featurePropertyChanged.propertyKey;
    print(`Changed "${key}" in all features of layer "${layer}"`);
  });

// Another file wanting to add another feature.
const featureX = new OlFeature({
  geometry: new OlGeomPoint([1000000, 1000000]),
});
mapEntry.getOlcOverlayLayer().addFeatures(layer1Id, [featureX]);

// Another file wanting to set a property in all features.
const features = mapEntry
  .getOlcOverlayLayer()
  .getFeaturesCollection(layer1Id)!
  .getArray();
mapEntry.getOlcOverlayLayer().setFeaturesProperty(layer1Id, features, 'protected', true);
