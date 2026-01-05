import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import storeManager from '../store-manager.js';
import OlLayerVector from 'ol/layer/Vector.js';
import OlSourceVector from 'ol/source/Vector.js';
import OlCollection from 'ol/Collection.js';
import OlFeature from 'ol/Feature.js';
import OlGeomPoint from 'ol/geom/Point.js';
import OlGeomLine from 'ol/geom/LineString.js';
import OlGeomPolygon from 'ol/geom/Polygon.js';
import OlGeomCircle from 'ol/geom/Circle.js';
import { getGeometryCenter } from '../../src/geometry/utils.js';

// Globally accessible values you need:
const backgroundLayer1Id = 'background1-id';
const layer1Id = 'layer1-id';

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
// A file that initializes the layers.
const backgroundLayer = new OlLayerTile({
  source: new OSM(),
});
const layer1 = new OlLayerVector({
  source: new OlSourceVector({
    features: new OlCollection([
      new OlFeature({
        geometry: new OlGeomPoint([3000000, -2000000]),
      }),
      new OlFeature({
        geometry: new OlGeomLine([
          [300000, 1500000],
          [550000, 1500000],
          [550000, 2000000],
        ]),
      }),
      new OlFeature({
        geometry: new OlGeomPolygon([
          [
            [300000, -1500000],
            [550000, -1500000],
            [850000, -3000000],
            [300000, -1500000],
          ],
        ]),
      }),
      new OlFeature({
        geometry: new OlGeomCircle([100000, -100000], 50000),
      }),
    ]),
  }),
});
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer, backgroundLayer1Id);
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);

// A file adding some code to custom +/- components.
document
  .querySelector('.zoom-in')!
  .addEventListener('click', () => mapEntry.getOlcView().zoom(1));
document
  .querySelector('.zoom-out')!
  .addEventListener('click', () => mapEntry.getOlcView().zoom(-1));

// A file zooming the view to features, with padding.
const featureExtent = mapEntry.getOlcOverlayLayer().getFeaturesExtent() ?? [];
document
  .querySelector('.fit')!
  .addEventListener('click', () => mapEntry.getOlcView().fit(featureExtent, 20, true));

// A file centering the view in the center of a feature.
const features =
  mapEntry.getOlcOverlayLayer().getVectorSource(layer1Id)?.getFeatures() ?? [];
let index = 0;
document.querySelector('.focus')!.addEventListener('click', () => {
  const idx = index % features.length;
  const geom = features[idx]?.getGeometry();
  if (geom) {
    const center = getGeometryCenter(geom);
    mapEntry.getOlcView().getView().animate({ zoom: 6, center: center });
  }
  index++;
});
