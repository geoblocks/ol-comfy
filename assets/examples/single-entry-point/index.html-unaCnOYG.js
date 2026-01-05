import { T as TileLayer, O as OSM, a as View, Z as Zoom } from "../../overlay-layer-group-BTOISlhP.js";
import { s as storeManager } from "../../store-manager-ofW-ldOS.js";
const backgroundLayer1 = new TileLayer({
  source: new OSM()
});
const backgroundLayer2 = new TileLayer({
  source: new OSM(),
  visible: false
});
const view1 = new View({
  center: [0, 0],
  zoom: 5
});
const view2 = new View({
  center: [0, 0],
  zoom: 2
});
const storesId1 = "store-1";
const storesId2 = "store-2";
const backgroundLayer1Id = "background1-id";
const backgroundLayer2Id = "background2-id";
const mapEntry1 = storeManager.getMapEntry(storesId1);
mapEntry1.getOlcMap().getMap().setTarget("map1");
mapEntry1.getOlcMap().getMap().setView(view1);
mapEntry1.getOlcBackgroundLayer().addLayer(backgroundLayer1, backgroundLayer1Id);
let mapEntry2 = storeManager.getMapEntry(storesId2);
mapEntry2.getOlcMap().getMap().setTarget("map2");
mapEntry2.getOlcMap().getMap().setView(view2);
mapEntry2.getOlcBackgroundLayer().addLayer(backgroundLayer2, backgroundLayer2Id);
mapEntry2 = storeManager.getMapEntry(storesId2);
mapEntry2.getOlcMap().addControl("zoom-control", new Zoom());
mapEntry2.getOlcBackgroundLayer().toggleVisible(backgroundLayer2Id);
