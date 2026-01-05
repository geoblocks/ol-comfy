import { T as TileLayer, O as OSM, V as VectorLayer, C as Collection, P as Polygon, a as View, M as Map, B as BackgroundLayerGroup, b as OverlayLayerGroup } from "../../overlay-layer-group-BTOISlhP.js";
import { V as VectorSource, F as Feature } from "../../Vector-D1eER0Rr.js";
const backgroundLayer = new TileLayer({
  source: new OSM()
});
const overlayLayer = new VectorLayer({
  source: new VectorSource({
    features: new Collection([
      new Feature({
        geometry: new Polygon([
          [
            [0, 0],
            [5e5, 1e6],
            [1e6, 0],
            [0, 0]
          ]
        ])
      })
    ])
  })
});
const view = new View({
  center: [0, 0],
  zoom: 2
});
const backgroundLayerId = "background1-id";
const overlayLayerId = "overlay1-id";
const olcMap = new Map(Map.createEmptyMap());
const backgroundLayerGroup = new BackgroundLayerGroup(olcMap.getMap());
const overlayLayerGroup = new OverlayLayerGroup(olcMap.getMap());
olcMap.getMap().setTarget("map");
olcMap.getMap().setView(view);
backgroundLayerGroup.addLayer(backgroundLayer, backgroundLayerId);
overlayLayerGroup.addLayer(overlayLayer, overlayLayerId);
olcMap.getMap();
backgroundLayerGroup.getLayer(backgroundLayerId);
overlayLayerGroup.getLayer(overlayLayerId);
