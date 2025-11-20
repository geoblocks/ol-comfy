import OlMap from 'ol/Map.js';
import OlOverlay from 'ol/Overlay.js';
import { getOlcVirtualGroupUid, olcVirtualGroupUidKey } from '../uid.js';

/**
 * Store and manage overlays (popups) on the map.
 */
export class Overlay {
  constructor(private readonly map: OlMap) {}

  /**
   * Add an overlay (with a group id) to the map.
   */
  addOverlay(overlayGroupUid: string, overlay: OlOverlay) {
    overlay.set(olcVirtualGroupUidKey, overlayGroupUid);
    this.map.addOverlay(overlay);
  }

  /**
   * @returns all overlay for a specific group.
   */
  getOverlays(overlayGroupUid: string) {
    return this.map
      .getOverlays()
      .getArray()
      .filter((overlay) => getOlcVirtualGroupUid(overlay) === overlayGroupUid);
  }

  /**
   * Clear from the map all existing overlays from a group.
   */
  clearOverlaysByGroupId(overlayGroupUid: string) {
    this.map
      .getOverlays()
      .getArray()
      .filter((overlay: OlOverlay) => getOlcVirtualGroupUid(overlay) === overlayGroupUid)
      .forEach((overlay: OlOverlay) => this.map.removeOverlay(overlay));
  }

  /**
   * Set z-index of an overlay.
   * @static
   */
  static setOverlayZindex(overlay: OlOverlay, zIndex: number) {
    const element = overlay.getElement()?.parentElement;
    if (element) {
      element.style.zIndex = `${zIndex}`;
    }
  }
}
