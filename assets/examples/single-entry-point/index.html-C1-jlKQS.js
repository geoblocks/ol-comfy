import { K as TileLayer, P as OSM, T as Zoom, q as View } from "../../overlay-layer-group-BsRRVz7F.js";
import { t as storeManager } from "../../store-manager-B_VMzd37.js";
//#region examples/single-entry-point/index.ts
var backgroundLayer1 = new TileLayer({ source: new OSM() });
var backgroundLayer2 = new TileLayer({
	source: new OSM(),
	visible: false
});
var view1 = new View({
	center: [0, 0],
	zoom: 5
});
var view2 = new View({
	center: [0, 0],
	zoom: 2
});
var storesId1 = "store-1";
var storesId2 = "store-2";
var backgroundLayer1Id = "background1-id";
var backgroundLayer2Id = "background2-id";
var mapEntry1 = storeManager.getMapEntry(storesId1);
mapEntry1.getOlcMap().getMap().setTarget("map1");
mapEntry1.getOlcMap().getMap().setView(view1);
mapEntry1.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
var mapEntry2 = storeManager.getMapEntry(storesId2);
mapEntry2.getOlcMap().getMap().setTarget("map2");
mapEntry2.getOlcMap().getMap().setView(view2);
mapEntry2.getOlcBackgroundLayer().addLayer(backgroundLayer2, backgroundLayer2Id);
mapEntry2 = storeManager.getMapEntry(storesId2);
mapEntry2.getOlcMap().addControl("zoom-control", new Zoom());
mapEntry2.getOlcBackgroundLayer().toggleVisible(backgroundLayer2Id);
//#endregion
