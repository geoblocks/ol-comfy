import { J as Polygon, K as TileLayer, P as OSM, q as View } from "../../overlay-layer-group-BsRRVz7F.js";
import { t as Draw } from "../../Draw-EjH2HWNj.js";
import { t as storeManager } from "../../store-manager-B_VMzd37.js";
//#region src/interaction/draw-shape.ts
/**
* @returns Drawing options to draw a box.
*/
var getDrawBoxOptions = () => {
	return {
		type: "LineString",
		maxPoints: 2,
		geometryFunction: (coordinates, geometry) => {
			if (!geometry) geometry = new Polygon([]);
			const start = coordinates[0];
			const end = coordinates[1];
			if (!Array.isArray(start) || !Array.isArray(end)) {
				console.error("Wrong coordinates type");
				return geometry;
			}
			geometry.setCoordinates([[
				start,
				[start[0], end[1]],
				end,
				[end[0], start[1]],
				start
			]]);
			return geometry;
		}
	};
};
//#endregion
//#region examples/draw-shape/index.ts
var backgroundLayer1Id = "background1-id";
var boxInteractionId = "box-interaction-uid";
var circleInteractionId = "circle-interaction-uid";
var mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(new View({
	center: [0, 0],
	zoom: 2
}));
mapEntry.getOlcMap().getMap().setTarget("map");
var backgroundLayer = new TileLayer({ source: new OSM() });
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer, backgroundLayer1Id);
var circleInteraction = new Draw({ type: "Circle" });
var boxInteraction = new Draw({ ...getDrawBoxOptions() });
mapEntry.getOlcDrawInteractionGroup().add(boxInteractionId, boxInteraction);
mapEntry.getOlcDrawInteractionGroup().add(circleInteractionId, circleInteraction);
mapEntry.getOlcDrawInteractionGroup().setActive(true, boxInteractionId);
document.getElementById("type").addEventListener("change", (evt) => {
	if (evt.target.value === "box") mapEntry.getOlcDrawInteractionGroup().setActive(true, boxInteractionId);
	else mapEntry.getOlcDrawInteractionGroup().setActive(true, circleInteractionId);
});
//#endregion
