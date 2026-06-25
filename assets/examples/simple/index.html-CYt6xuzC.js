import { F as VectorSource, G as Feature, J as Polygon, K as TileLayer, O as VectorLayer, P as OSM, U as Collection, i as BackgroundLayerGroup, n as OverlayLayerGroup, q as View, r as Map } from "../../overlay-layer-group-BsRRVz7F.js";
//#region examples/simple/index.ts
var backgroundLayer = new TileLayer({ source: new OSM() });
var overlayLayer = new VectorLayer({ source: new VectorSource({ features: new Collection([new Feature({ geometry: new Polygon([[
	[0, 0],
	[5e5, 1e6],
	[1e6, 0],
	[0, 0]
]]) })]) }) });
var view = new View({
	center: [0, 0],
	zoom: 2
});
var backgroundLayerId = "background1-id";
var overlayLayerId = "overlay1-id";
var olcMap = new Map(Map.createEmptyMap());
var backgroundLayerGroup = new BackgroundLayerGroup(olcMap.getMap());
var overlayLayerGroup = new OverlayLayerGroup(olcMap.getMap());
olcMap.getMap().setTarget("map");
olcMap.getMap().setView(view);
backgroundLayerGroup.addLayer(backgroundLayer, backgroundLayerId);
overlayLayerGroup.addLayer(overlayLayer, overlayLayerId);
olcMap.getMap();
backgroundLayerGroup.findLayer(backgroundLayerId);
overlayLayerGroup.findLayer(overlayLayerId);
//#endregion
