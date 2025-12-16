import { describe, beforeEach, it, expect } from 'vitest';
import OlView from 'ol/View.js';
import { Map } from '../map/map.js';
import { View } from './view.js';
import { OPENLAYERS_ANIMATION_DELAY } from '../const-from-outside.js';

/* Standard OpenLayers animation duration is 250ms. Add 50 more to be sure. */
const ANIMATION_WAIT_TIME = OPENLAYERS_ANIMATION_DELAY + 50;

describe('ViewStore', () => {
  let olcView: View;

  beforeEach(() => {
    const map = Map.createEmptyMap();
    olcView = new View(map);
    // Set the view after assigning the view. The view should be this one in the
    // ol-comfy view.
    map.setView(new OlView({ center: [0, 0], zoom: 2 }));
  });

  // Can't test "fit" easily because no map is rendered. Leave that to the
  // end-to-end tests.

  it('should zoom in', () =>
    new Promise((done) => {
      olcView.zoom(1);
      // Let time to the map to zoom
      setTimeout(() => {
        expect(olcView.getView().getZoom()).toEqual(3);
        done('Done');
      }, ANIMATION_WAIT_TIME);
    }));

  it('should zoom out', () =>
    new Promise((done) => {
      // Exaggerate zoom out. Should work, but goes to zoom level 0.
      olcView.zoom(-1000);
      // Let time to the map to zoom
      setTimeout(() => {
        expect(olcView.getView().getZoom()).toEqual(0);
        done('Done');
      }, ANIMATION_WAIT_TIME);
    }));
});
