import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import OlInteractionDraw from 'ol/interaction/Draw.js';
import { getDrawBoxOptions } from '../../src/interaction/draw-shape.js';
import storeManager from '../store-manager.js';

// Globally accessible values you need:
const backgroundLayer1Id = 'background1-id';
const boxInteractionId = 'box-interaction-uid';
const circleInteractionId = 'circle-interaction-uid';

// A file initializing the map using the storeManager and the mapEntry.
const mapEntry = storeManager.getMapEntry();
mapEntry
  .getOlcMap()
  .getMap()
  .setView(
    new OlView({
      center: [0, 0],
      zoom: 2,
    }),
  );
mapEntry.getOlcMap().getMap().setTarget('map');

// Below: Use ol-comfy and the example's mapEntry.
// A file that initializes the layers.
const backgroundLayer = new OlLayerTile({
  source: new OSM(),
});
mapEntry.getOlcBackgroundLayer().addLayer(backgroundLayer, backgroundLayer1Id);

// A file that initializes the interactions.
const circleInteraction = new OlInteractionDraw({
  type: 'Circle',
});
const boxInteraction = new OlInteractionDraw({
  ...getDrawBoxOptions(),
});
mapEntry.getOlcDrawInteractionGroup().add(boxInteractionId, boxInteraction);
mapEntry.getOlcDrawInteractionGroup().add(circleInteractionId, circleInteraction);
mapEntry.getOlcDrawInteractionGroup().setActive(true, boxInteractionId);

// Listen to the inputs to enable the right tool. With ol-comfy, enabling a
// draw tool auto-deactivates other drawing tools.
const typeSelect = document.getElementById('type');
typeSelect!.addEventListener('change', (evt) => {
  if ((evt.target as HTMLInputElement).value === 'box') {
    mapEntry.getOlcDrawInteractionGroup().setActive(true, boxInteractionId);
  } else {
    mapEntry.getOlcDrawInteractionGroup().setActive(true, circleInteractionId);
  }
});
