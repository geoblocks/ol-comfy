import { F as VectorSource, G as Feature, K as TileLayer, O as VectorLayer, P as OSM, U as Collection, Z as Point, q as View, s as olcUidKey, t as FeaturePropertyChangedEventType } from "../../overlay-layer-group-BsRRVz7F.js";
import { t as storeManager } from "../../store-manager-B_VMzd37.js";
//#region examples/layer/index.ts
var print = (msg) => {
	document.querySelector("#console .text").textContent = msg;
};
var layer1Id = "layer1-id";
var backgroundLayer1Id = "background1-id";
var mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(new View({
	center: [0, 0],
	zoom: 2
}));
mapEntry.getOlcMap().getMap().setTarget("map");
var layer1 = new VectorLayer({ source: new VectorSource({ features: new Collection([new Feature({ geometry: new Point([0, 0]) })]) }) });
var backgroundLayer1 = new TileLayer({ source: new OSM() });
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
mapEntry.getOlcOverlayLayer().on(FeaturePropertyChangedEventType, (featurePropertyChanged) => {
	const layer = featurePropertyChanged[olcUidKey];
	const key = featurePropertyChanged.propertyKey;
	print(`Changed "${key}" in all features of layer "${layer}"`);
});
var featureX = new Feature({ geometry: new Point([1e6, 1e6]) });
mapEntry.getOlcOverlayLayer().addFeatures(layer1Id, [featureX]);
var features = mapEntry.getOlcOverlayLayer().getFeaturesCollection(layer1Id).getArray();
mapEntry.getOlcOverlayLayer().setFeaturesProperty(layer1Id, features, "protected", true);
//#endregion
