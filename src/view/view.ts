import OlMap from 'ol/Map.js';
import OlView from 'ol/View.js';
import { type Extent as OlExtent } from 'ol/extent.js';
import { getPointResolution } from 'ol/proj.js';
import { OPENLAYERS_ANIMATION_DELAY } from '../const-from-outside.js';
import { type EventsKey } from 'ol/events.js';
import { isNil } from '../utils.js';
import { unByKey } from 'ol/Observable.js';

/**
 * Helpers for the view in the map.
 * With the "listen" option, this class will automatically keep the used map's
 * view if the map's view is set.
 */
export class View {
  private readonly eventsKeys: EventsKey[] = [];
  private readonly map: OlMap;
  private view: OlView;

  constructor(map: OlMap, listen = true) {
    this.map = map;
    this.view = this.map.getView();
    if (listen) {
      this.eventsKeys.push(
        this.map.on('change:view', () => (this.view = this.map.getView())),
      );
    }
  }

  /**
   * @returns the Ol view.
   */
  getView(): OlView {
    return this.view;
  }

  /**
   * Removes the map view change listener.
   */
  destroy() {
    unByKey(this.eventsKeys);
  }

  /**
   * @returns The point resolution at a coordinate of the map.
   */
  getPointResolution(coordinates: number[]): number | undefined {
    const resolution = this.view.getResolution();
    if (isNil(resolution)) {
      return undefined;
    }
    return getPointResolution(this.view.getProjection(), resolution!, coordinates);
  }

  /**
   * Set the view to the new nearest extent.
   * @param extent The new extent of the map.
   * @param padding The padding (in pixels) to add around this extent.
   * @param animated If true, the map will "move" to the new extent. See also OL view.animate.
   */
  fit(extent: OlExtent, padding: number, animated = false) {
    const boxPadding = [0, 0, 0, 0].fill(padding);
    const duration = animated ? OPENLAYERS_ANIMATION_DELAY : 0;
    this.view.fit(extent, { nearest: true, padding: boxPadding, duration });
  }

  /**
   * Zoom in or zoom out to the nearest resolution using a small animation.
   * @param delta number of resolution step to zoom in (positive value) or
   *     zoom out (negative value);
   */
  zoom(delta: number) {
    const currentZoom = this.view.getZoom();
    if (isNil(currentZoom)) {
      return;
    }
    const newZoom = this.view.getConstrainedZoom(currentZoom! + delta);
    if (isNil(newZoom)) {
      return;
    }
    if (this.view.getAnimating()) {
      this.view.cancelAnimations();
    }
    this.view.animate({
      zoom: newZoom,
      duration: OPENLAYERS_ANIMATION_DELAY,
    });
  }
}
