import { P as Polygon, a as View, T as TileLayer, O as OSM } from "../../overlay-layer-group-BfY9vUif.js";
import { D as Draw } from "../../Draw-BpCrSsWU.js";
import { s as storeManager } from "../../store-manager-Co3Dgiy_.js";
import "../../Vector-B4qeoSRe.js";
import "../../LineString-MY1gkKNK.js";
const getDrawBoxOptions = () => {
  return {
    type: "LineString",
    maxPoints: 2,
    geometryFunction: (coordinates, geometry) => {
      if (!geometry) {
        geometry = new Polygon([]);
      }
      const start = coordinates[0];
      const end = coordinates[1];
      if (!Array.isArray(start) || !Array.isArray(end)) {
        console.error("Wrong coordinates type");
        return geometry;
      }
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start]
      ]);
      return geometry;
    }
  };
};
const backgroundLayer1Id = "background1-id";
const boxInteractionId = "box-interaction-uid";
const circleInteractionId = "circle-interaction-uid";
const mapEntry = storeManager.getMapEntry();
mapEntry.getOlcMap().getMap().setView(
  new View({
    center: [0, 0],
    zoom: 2
  })
);
mapEntry.getOlcMap().getMap().setTarget("map");
const backgroundLayer = new TileLayer({
  source: new OSM()
});
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer, backgroundLayer1Id);
const circleInteraction = new Draw({
  type: "Circle"
});
const boxInteraction = new Draw({
  ...getDrawBoxOptions()
});
mapEntry.getOlcDrawInteractionGroup().add(boxInteractionId, boxInteraction);
mapEntry.getOlcDrawInteractionGroup().add(circleInteractionId, circleInteraction);
mapEntry.getOlcDrawInteractionGroup().setActive(true, boxInteractionId);
const typeSelect = document.getElementById("type");
typeSelect.addEventListener("change", (evt) => {
  if (evt.target.value === "box") {
    mapEntry.getOlcDrawInteractionGroup().setActive(true, boxInteractionId);
  } else {
    mapEntry.getOlcDrawInteractionGroup().setActive(true, circleInteractionId);
  }
});
