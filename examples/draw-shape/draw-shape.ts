import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import { OSM } from 'ol/source.js';
import { Map } from '../../src/map/map.js';
import { BackgroundLayerGroup } from '../../src/layer/background-layer-group.js';
import { InteractionGroup } from '../../src/interaction/interactionGroup.js';
import OlInteractionDraw from 'ol/interaction/Draw.js';
import { getDrawBoxOptions } from '../../src/interaction/drawShape.js';

// Globally accessible values you need:
const backgroundLayer1Id = 'background1-id';
const boxInteractionId = 'box-interaction-uid';
const circleInteractionId = 'circle-interaction-uid';

// Your controller initializing the map.
const map = Map.createEmptyMap();
map.setView(
  new OlView({
    center: [0, 0],
    zoom: 2,
  }),
);
map.setTarget('map');

// Below: Use ol-comfy.
// Your controller that initializes the layers.
const backgroundLayerGroup = new BackgroundLayerGroup(map);
const backgroundLayer = new OlLayerTile({
  source: new OSM(),
});
backgroundLayerGroup.addLayer(backgroundLayer, backgroundLayer1Id);

// Your controller that initializes the interactions.
const interactionGroupToDraw = new InteractionGroup(map, 'drawGroup');
const circleInteraction = new OlInteractionDraw({
  type: 'Circle',
});
const boxInteraction = new OlInteractionDraw({
  ...getDrawBoxOptions(),
});
interactionGroupToDraw.add(boxInteractionId, boxInteraction);
interactionGroupToDraw.add(circleInteractionId, circleInteraction);
interactionGroupToDraw.setActive(true, boxInteractionId);

// Listen to the inputs to enable the right tool. With ol-comfy, enabling a
// draw tool auto-deactivates other drawing tools.
const typeSelect = document.getElementById('type');
typeSelect!.addEventListener('change', (evt) => {
  if ((evt.target as HTMLInputElement).value === 'box') {
    interactionGroupToDraw.setActive(true, boxInteractionId);
  } else {
    interactionGroupToDraw.setActive(true, circleInteractionId);
  }
});
