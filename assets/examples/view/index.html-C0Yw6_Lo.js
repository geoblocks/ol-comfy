import { F as VectorSource, G as Feature, H as LineString, J as Polygon, K as TileLayer, O as VectorLayer, P as OSM, U as Collection, Z as Point, kt as getCenter, q as View } from "../../overlay-layer-group-BsRRVz7F.js";
import { t as Circle } from "../../Circle-DohvwKSI.js";
import { t as storeManager } from "../../store-manager-B_VMzd37.js";
//#region src/geometry/utils.ts
/**
* Returns the center of a geometry.
* Interior point of a polygon, center of a line, center of a point, or center of the geom extent.
* @Returns the geographical center of a geometry.
*/
var getGeometryCenter = (geom) => {
	if (geom instanceof Polygon) {
		const interiorPoint = geom.getInteriorPoint()?.getCoordinates();
		if (interiorPoint && interiorPoint.length >= 2) return [interiorPoint[0], interiorPoint[1]];
	}
	if (geom instanceof LineString) return geom.getFlatMidpoint();
	if (geom instanceof Point) return geom.getCoordinates();
	return getCenter(geom.getExtent());
};
//#endregion
//#region examples/view/index.ts
var backgroundLayer1Id = "background1-id";
var layer1Id = "layer1-id";
var mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(new View({
	center: [0, 0],
	zoom: 2
}));
mapEntry.getOlcMap().getMap().setTarget("map");
var backgroundLayer = new TileLayer({ source: new OSM() });
var layer1 = new VectorLayer({ source: new VectorSource({ features: new Collection([
	new Feature({ geometry: new Point([3e6, -2e6]) }),
	new Feature({ geometry: new LineString([
		[3e5, 15e5],
		[55e4, 15e5],
		[55e4, 2e6]
	]) }),
	new Feature({ geometry: new Polygon([[
		[3e5, -15e5],
		[55e4, -15e5],
		[85e4, -3e6],
		[3e5, -15e5]
	]]) }),
	new Feature({ geometry: new Circle([1e5, -1e5], 5e4) })
]) }) });
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer, backgroundLayer1Id);
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
document.querySelector(".zoom-in").addEventListener("click", () => mapEntry.getOlcView().zoom(1));
document.querySelector(".zoom-out").addEventListener("click", () => mapEntry.getOlcView().zoom(-1));
var featureExtent = mapEntry.getOlcOverlayLayer().getFeaturesExtent() ?? [];
document.querySelector(".fit").addEventListener("click", () => mapEntry.getOlcView().fit(featureExtent, 20, true));
var features = mapEntry.getOlcOverlayLayer().getVectorSource(layer1Id)?.getFeatures() ?? [];
var index = 0;
document.querySelector(".focus").addEventListener("click", () => {
	const geom = features[index % features.length]?.getGeometry();
	if (geom) {
		const center = getGeometryCenter(geom);
		mapEntry.getOlcView().getView().animate({
			zoom: 6,
			center
		});
	}
	index++;
});
//#endregion
