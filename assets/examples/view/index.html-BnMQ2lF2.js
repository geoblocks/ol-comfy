import { P as Polygon, l as Point, a5 as getCenter, a as View, T as TileLayer, O as OSM, V as VectorLayer, C as Collection } from "../../overlay-layer-group-BTOISlhP.js";
import { s as storeManager } from "../../store-manager-ofW-ldOS.js";
import { V as VectorSource, F as Feature } from "../../Vector-D1eER0Rr.js";
import { L as LineString, C as Circle } from "../../LineString-DRa7gE46.js";
const getGeometryCenter = (geom) => {
  if (geom instanceof Polygon) {
    const interiorPoint = geom.getInteriorPoint()?.getCoordinates();
    if (interiorPoint && interiorPoint.length >= 2) {
      return [interiorPoint[0], interiorPoint[1]];
    }
  }
  if (geom instanceof LineString) {
    return geom.getFlatMidpoint();
  }
  if (geom instanceof Point) {
    return geom.getCoordinates();
  }
  return getCenter(geom.getExtent());
};
const backgroundLayer1Id = "background1-id";
const layer1Id = "layer1-id";
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
const layer1 = new VectorLayer({
  source: new VectorSource({
    features: new Collection([
      new Feature({
        geometry: new Point([3e6, -2e6])
      }),
      new Feature({
        geometry: new LineString([
          [3e5, 15e5],
          [55e4, 15e5],
          [55e4, 2e6]
        ])
      }),
      new Feature({
        geometry: new Polygon([
          [
            [3e5, -15e5],
            [55e4, -15e5],
            [85e4, -3e6],
            [3e5, -15e5]
          ]
        ])
      }),
      new Feature({
        geometry: new Circle([1e5, -1e5], 5e4)
      })
    ])
  })
});
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer, backgroundLayer1Id);
mapEntry.getOlcOverlayLayer().addLayer(layer1, layer1Id);
document.querySelector(".zoom-in").addEventListener("click", () => mapEntry.getOlcView().zoom(1));
document.querySelector(".zoom-out").addEventListener("click", () => mapEntry.getOlcView().zoom(-1));
const featureExtent = mapEntry.getOlcOverlayLayer().getFeaturesExtent() ?? [];
document.querySelector(".fit").addEventListener("click", () => mapEntry.getOlcView().fit(featureExtent, 20, true));
const features = mapEntry.getOlcOverlayLayer().getVectorSource(layer1Id)?.getFeatures() ?? [];
let index = 0;
document.querySelector(".focus").addEventListener("click", () => {
  const idx = index % features.length;
  const geom = features[idx]?.getGeometry();
  if (geom) {
    const center = getGeometryCenter(geom);
    mapEntry.getOlcView().getView().animate({ zoom: 6, center });
  }
  index++;
});
