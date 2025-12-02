import { Map } from '../../src/map/map.js';
import OlView from 'ol/View.js';
import OlLayerTile from 'ol/layer/Tile.js';
import OlLayerVector from 'ol/layer/Vector.js';
import OlSourceVector from 'ol/source/Vector.js';
import OlCollection from 'ol/Collection.js';
import OlFeature from 'ol/Feature.js';
import { OSM } from 'ol/source.js';
import OlGeometry from 'ol/geom/Geometry.js';
import RenderFeature from 'ol/render/Feature.js';
import OlStyle from 'ol/style/Style.js';
import OlInteractionDraw from 'ol/interaction/Draw.js';
import OlInteractionTranslate from 'ol/interaction/Translate.js';
import OlInteractionModify from 'ol/interaction/Modify.js';
import OlInteractionSnap from 'ol/interaction/Snap.js';
import { condition, conditionThen } from '../../src/event/condition.js';
import { ListenKey } from '../../src/event/listen-key.js';
import { updateLayerStyle } from '../../src/layer/utils.js';
import { MapBrowserEvent } from 'ol';
import { type EventsKey } from 'ol/events.js';
import { BackgroundLayerGroup } from '../../src/layer/background-layer-group.js';
import { OverlayLayerGroup } from '../../src/layer/overlay-layer-group.js';
import OlCircle from 'ol/style/Circle.js';
import OlFill from 'ol/style/Fill.js';
import OlStroke from 'ol/style/Stroke.js';
import OlGeomPoint from 'ol/geom/Point.js';
import OlGeomLine from 'ol/geom/LineString.js';
import { platformModifierKeyOnly, click } from 'ol/events/condition.js';
import { EmptyStyle } from '../../src/style.js';
import { InteractionGroup } from '../../src/interaction/interactionGroup.js';
import { overEvery } from '../../src/utils.js';
import { unByKey } from 'ol/Observable.js';

// Globally accessible values you need:
const map = Map.createEmptyMap();
const layer1Id = 'layer1-id';
const backgroundLayer1Id = 'background1-id';
const pointInteractionId = 'point-interaction-uid';
const lineInteractionId = 'line-interaction-uid';
const modifyInteractionId = 'modify-interaction-uid';

// Setup example.
const layer1 = new OlLayerVector({
  source: new OlSourceVector({
    features: new OlCollection([new OlFeature()]),
  }),
});
const backgroundLayer1 = new OlLayerTile({
  source: new OSM(),
});
const print = (msg: string) => {
  document.querySelector('#console .text')!.textContent = msg;
};

// Your controller initializing the map.
map.setView(
  new OlView({
    center: [0, 0],
    zoom: 2,
  }),
);
map.setTarget('map');

// Below: Use ol-comfy.
// Your controller that initializes the layers and interactions.
let overlayLayerGroup = new OverlayLayerGroup(map);
overlayLayerGroup.addLayer(layer1, layer1Id);
const backgroundLayerGroup = new BackgroundLayerGroup(map);
backgroundLayerGroup.addLayer(backgroundLayer1, backgroundLayer1Id);
const interactionGroupToModify = new InteractionGroup(map, 'modifyGroup');
const interactionGroupToDraw = new InteractionGroup(map, 'drawGroup');

// A component wanting to enable draw.
let drawPoint: OlInteractionDraw | undefined;
let drawLine: OlInteractionDraw | undefined;
let modify: OlInteractionModify | undefined;
let translate: OlInteractionTranslate | undefined;
let snap: OlInteractionSnap | undefined;
let listenKey: ListenKey | undefined;
const eventKeys: EventsKey[] = [];

/**
 * Create and configure map interaction to draw.
 * That's a full example with draw, modification, translation, deletion with
 * custom condition and custom styling.
 */
const setupDrawing = () => {
  // Set up the layer to draw in.
  overlayLayerGroup = new OverlayLayerGroup(map);
  const drawLayer = overlayLayerGroup?.getLayer(layer1Id) as
    | OlLayerVector<OlSourceVector<OlFeature>>
    | undefined;
  const source = drawLayer?.getSource();
  if (!drawLayer || !source || !map) {
    console.error('No layer source or no map to draw in.');
    return;
  }
  updateLayerStyle(drawLayer, createStyle);
  // Set up listening of the "delete" key;
  listenKey = new ListenKey('Delete');
  // Setup drawing.
  drawPoint = new OlInteractionDraw({
    source,
    type: 'Point',
    condition: () => !listenKey?.isKeyDown(),
    style: createStyle,
  });
  interactionGroupToDraw.add(pointInteractionId, drawPoint);
  drawLine = new OlInteractionDraw({
    source,
    type: 'LineString',
    condition: () => !listenKey?.isKeyDown(),
    style: createStyle,
  });
  interactionGroupToDraw.add(lineInteractionId, drawLine);
  // Set up the "modify" and "translate" drawing interactions. Delete with delete+click.
  modify = new OlInteractionModify({
    source,
    style: createStyle,
    // Use "overEvery" or "overSome" or a custom function to chain conditions.
    deleteCondition: conditionThen(
      overEvery([click, condition(() => listenKey!.isKeyDown())]),
      delayOnDeleteAction.bind(this),
    ),
  });
  interactionGroupToModify.add(modifyInteractionId, modify);
  translate = new OlInteractionTranslate({
    layers: [drawLayer],
    condition: platformModifierKeyOnly,
  });
  interactionGroupToModify.add('translate', translate);
  snap = new OlInteractionSnap({
    source,
  });
  interactionGroupToModify.add('snap', snap);
  // Custom listener for this component.
  // Case where we can't directly reach the drawPoint or drawLine instance.
  eventKeys.push(
    interactionGroupToDraw.find(pointInteractionId)?.on('drawend', () => {
      print(`Point added.`);
    }),
    interactionGroupToDraw.find(lineInteractionId)?.on('drawend', () => {
      print(`Line added.`);
    }),
  );
};

/**
 * Not ol-comfy, but nice to have to customize style.
 */
const createStyle = (
  feature: OlFeature<OlGeometry> | RenderFeature,
): OlStyle | OlStyle[] => {
  const geometry = feature?.getGeometry();
  const type = geometry?.getType();
  if (['MultiPoint', 'Point'].includes(`${type}`) && geometry) {
    // Get color from the geometry, could be linked to a feature property as
    // well (f.i. with a color picker that set feature's value).
    const xCoordinate = (geometry as OlGeomPoint).getCoordinates()[0] ?? 0;
    const color = Math.round((Math.abs(xCoordinate) / (20037508 / 2)) * 255);
    return new OlStyle({
      image: new OlCircle({
        radius: 8,
        fill: new OlFill({
          color: `rgba(${color}, 0, 0, 0.7)`,
        }),
        stroke: new OlStroke({
          color: `rgba(${color}, 0, 0, 0.7)`,
        }),
      }),
    });
  } else if (['LineString', 'MultiLineString'].includes(`${type}`) && geometry) {
    return new OlStyle({
      stroke: new OlStroke({
        color: 'rgba(200, 150, 0, 0.8)',
        width: 4,
      }),
    });
  } else {
    return EmptyStyle;
  }
};

/**
 * Delay the delete action to be sure that the OpenLayers is not
 * currently modifying the feature. (Like in lines, it seems to quickly
 * add then removes the coordinates on click, even with conditions).
 */
const delayOnDeleteAction = (mapBrowserEvent: MapBrowserEvent) => {
  setTimeout(() => onDeleteAction(mapBrowserEvent), 20);
};

/**
 * Not ol-comfy but nice to have to delete feature.
 * It's given as a callback to the ol-comfy delete condition.
 */
const onDeleteAction = (mapBrowserEvent: MapBrowserEvent) => {
  mapBrowserEvent.map.forEachFeatureAtPixel(
    mapBrowserEvent.pixel,
    (feature: OlFeature<OlGeometry> | RenderFeature) => {
      if (!overlayLayerGroup || feature instanceof RenderFeature) {
        return;
      }
      // Don't remove a line if there are more than two vertexes.
      const geometry = feature.getGeometry();
      if (
        !geometry ||
        (geometry.getType() === 'LineString' &&
          (geometry as OlGeomLine).getCoordinates().length > 2)
      ) {
        return;
      }
      // Remove feature
      const features =
        overlayLayerGroup.getFeaturesCollection(layer1Id)?.getArray() || [];
      if (features.includes(feature)) {
        overlayLayerGroup.removeFeatures(layer1Id, [feature]);
        // Make the pointer to be updated in Firefox;
        const modify = interactionGroupToModify.find(modifyInteractionId);
        modify?.setActive(false);
        modify?.setActive(true);
      }
    },
  );
};

/**
 * Should be set on a component to remove interaction from the map.
 * Not (really) used in this demo.
 */
const destroy = (isDemo: boolean) => {
  if (isDemo) {
    return;
  }
  unByKey(eventKeys);
  interactionGroupToDraw.destroy();
  interactionGroupToModify.destroy();
  listenKey?.destroy();
};

// Init the "component".
setupDrawing();
interactionGroupToDraw.setActive(true, pointInteractionId);
destroy(true);

// Listen to the inputs to enable the right tool. With ol-comfy, enabling a
// draw tool auto-deactivates other drawing tools.
const typeSelect = document.getElementById('type');
typeSelect!.addEventListener('change', (evt) => {
  if ((evt.target as HTMLInputElement).value === 'point') {
    interactionGroupToDraw.setActive(true, pointInteractionId);
  } else {
    interactionGroupToDraw.setActive(true, lineInteractionId);
  }
});
