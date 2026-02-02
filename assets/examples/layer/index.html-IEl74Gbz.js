import { a as View, V as VectorLayer, C as Collection, l as Point, T as TileLayer, O as OSM, aA as FeaturePropertyChangedEventType, aB as olcUidKey } from "../../overlay-layer-group-BfY9vUif.js";
import { V as VectorSource, F as Feature } from "../../Vector-B4qeoSRe.js";
import { s as storeManager } from "../../store-manager-Co3Dgiy_.js";
const print = (msg) => {
  document.querySelector("#console .text").textContent = msg;
};
const layer1Id = "layer1-id";
const backgroundLayer1Id = "background1-id";
const mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(
  new View({
    center: [0, 0],
    zoom: 2
  })
);
mapEntry.getOlcMap().getMap().setTarget("map");
const layer1 = new VectorLayer({
  source: new VectorSource({
    features: new Collection([
      new Feature({
        geometry: new Point([0, 0])
      })
    ])
  })
});
const backgroundLayer1 = new TileLayer({
  source: new OSM()
});
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
mapEntry.getOlcOverlayLayer().on(FeaturePropertyChangedEventType, (featurePropertyChanged) => {
  const layer = featurePropertyChanged[olcUidKey];
  const key = featurePropertyChanged.propertyKey;
  print(`Changed "${key}" in all features of layer "${layer}"`);
});
const featureX = new Feature({
  geometry: new Point([1e6, 1e6])
});
mapEntry.getOlcOverlayLayer().addFeatures(layer1Id, [featureX]);
const features = mapEntry.getOlcOverlayLayer().getFeaturesCollection(layer1Id).getArray();
mapEntry.getOlcOverlayLayer().setFeaturesProperty(layer1Id, features, "protected", true);
