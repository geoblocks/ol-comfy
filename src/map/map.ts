import OlMap from 'ol/Map.js';
import OlControl from 'ol/control/Control.js';
import { getOlcUid, olcUidKey } from '../uid.js';

/**
 * Provides helper for OL map.
 */
export class Map {
  constructor(private readonly map: OlMap) {}

  /**
   * @returns The Ol map.
   */
  getMap(): OlMap {
    return this.map;
  }

  /**
   * Based on the control unique id, check whether the control is already on
   * the map.
   */
  hasControl(controlUid: string): boolean {
    return this.map
      .getControls()
      .getArray()
      .some((control) => getOlcUid(control) === controlUid);
  }

  /**
   * Add an identified control into the map.
   * @param controlUid the (uniq) id of the controller. If it already
   * exists, the control will not be added.
   * @param control the control to add.
   */
  addControl(controlUid: string, control: OlControl) {
    if (this.hasControl(controlUid)) {
      return;
    }
    control.set(olcUidKey, controlUid);
    this.map.addControl(control);
  }

  /**
   * @returns an new empty map (no layer, no controls).
   */
  static createEmptyMap(): OlMap {
    return new OlMap({
      controls: [],
      layers: [],
    });
  }
}
