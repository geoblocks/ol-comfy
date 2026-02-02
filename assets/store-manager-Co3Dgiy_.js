import { b5 as getOlcVirtualGroupUid, aB as olcUidKey, b6 as olcVirtualGroupUidKey, b7 as getOlcUid, S as unByKey, b8 as isNil, b9 as getPointResolution, M as Map, B as BackgroundLayerGroup, b as OverlayLayerGroup } from "./overlay-layer-group-BfY9vUif.js";
const DefaultGroupUid = "olcInteractionGroup";
class InteractionGroup {
  map;
  virtualGroupUid;
  constructor(map, virtualGroupUid) {
    this.map = map;
    this.virtualGroupUid = virtualGroupUid ?? DefaultGroupUid;
  }
  /**
   * @returns all the interaction of the wanted group.
   */
  getGroupInteractions() {
    return this.map.getInteractions().getArray().filter(
      (interaction) => getOlcVirtualGroupUid(interaction) === this.virtualGroupUid
    );
  }
  /**
   * Adds the given interaction to the given map with an uid.
   * The interaction can't be in multiple groups at the same time.
   * @param uid - The uid to associate with the interaction
   * @param interaction - The interaction to add
   */
  add(uid, interaction) {
    if (this.hasInteraction(uid)) {
      console.warn(
        `Interaction with uid "${uid}" already exists in group "${this.virtualGroupUid}"`
      );
      return;
    }
    const interactionGroupUid = getOlcVirtualGroupUid(interaction);
    if (interactionGroupUid) {
      console.warn(
        `Interaction with uid "${uid}" already exists in group "${interactionGroupUid}"`
      );
      return;
    }
    interaction.set(olcUidKey, uid);
    interaction.set(olcVirtualGroupUidKey, this.virtualGroupUid);
    this.map.addInteraction(interaction);
  }
  /**
   * Finds an interaction by its uid
   * @param uid - The uid of the interaction to find
   * @returns The interaction if found, undefined otherwise
   */
  find(uid) {
    return this.getGroupInteractions().find((interaction) => {
      return getOlcUid(interaction) === uid;
    });
  }
  /**
   * Finds all interaction having uid included in the provided uid.
   * @param uidPart - A start part uid of the interaction to find.
   * @returns The interaction if found or undefined otherwise.
   */
  findByIncluding(uidPart) {
    return this.getGroupInteractions().filter((interaction) => {
      return `${getOlcUid(interaction)}`.includes(uidPart);
    });
  }
  /**
   * Removes the given interaction from the map.
   * @param uid - The uid of the interaction to remove
   */
  remove(uid) {
    const interaction = this.find(uid);
    if (!interaction) {
      return;
    }
    interaction.unset(olcVirtualGroupUidKey);
    this.map.removeInteraction(interaction);
  }
  /**
   * Verifies if the interaction is already present in the map
   * @param uid The uid of the interaction to check
   * @returns boolean indicating if the interaction is present
   */
  hasInteraction(uid) {
    return this.getGroupInteractions().some(
      (interaction) => getOlcUid(interaction) === uid
    );
  }
  /**
   * Activate the interaction (and deactivate other interactions of this group) or
   * deactivate it.
   */
  setActive(active, uid) {
    const interaction = this.find(uid);
    if (!interaction) {
      return;
    }
    if (active) {
      this.use(interaction);
    } else {
      interaction.setActive(false);
    }
  }
  /**
   * Deactivate all draw interaction of this group.
   */
  deactivateAll() {
    return this.getGroupInteractions().forEach(
      (interaction) => interaction.setActive(false)
    );
  }
  /**
   * Deactivates and remove every interaction of this group.
   */
  destroy() {
    this.deactivateAll();
    this.getGroupInteractions().forEach((interaction) => {
      this.remove(getOlcUid(interaction) ?? "");
    });
  }
  /**
   * Deactivate all interaction of this group and activate the given one.
   * @protected
   */
  use(interaction) {
    this.deactivateAll();
    interaction.setActive(true);
  }
}
const OPENLAYERS_ANIMATION_DELAY = 250;
class View {
  eventsKeys = [];
  map;
  view;
  constructor(map, listen = true) {
    this.map = map;
    this.view = this.map.getView();
    if (listen) {
      this.eventsKeys.push(
        this.map.on("change:view", () => this.view = this.map.getView())
      );
    }
  }
  /**
   * @returns the Ol view.
   */
  getView() {
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
  getPointResolution(coordinates) {
    const resolution = this.view.getResolution();
    if (isNil(resolution)) {
      return void 0;
    }
    return getPointResolution(this.view.getProjection(), resolution, coordinates);
  }
  /**
   * Set the view to the new nearest extent.
   * @param extent The new extent of the map.
   * @param padding The padding (in pixels) to add around this extent.
   * @param animated If true, the map will "move" to the new extent. See also OL view.animate.
   */
  fit(extent, padding, animated = false) {
    const boxPadding = [0, 0, 0, 0].fill(padding);
    const duration = animated ? OPENLAYERS_ANIMATION_DELAY : 0;
    this.view.fit(extent, { nearest: true, padding: boxPadding, duration });
  }
  /**
   * Zoom in or zoom out to the nearest resolution using a small animation.
   * @param delta number of resolution step to zoom in (positive value) or
   *     zoom out (negative value);
   */
  zoom(delta) {
    const currentZoom = this.view.getZoom();
    if (isNil(currentZoom)) {
      return;
    }
    const newZoom = this.view.getConstrainedZoom(currentZoom + delta);
    if (isNil(newZoom)) {
      return;
    }
    if (this.view.getAnimating()) {
      this.view.cancelAnimations();
    }
    this.view.animate({
      zoom: newZoom,
      duration: OPENLAYERS_ANIMATION_DELAY
    });
  }
}
class Overlay {
  constructor(map) {
    this.map = map;
  }
  /**
   * Add an overlay (with a group id) to the map.
   */
  addOverlay(overlayGroupUid, overlay) {
    overlay.set(olcVirtualGroupUidKey, overlayGroupUid);
    this.map.addOverlay(overlay);
  }
  /**
   * @returns all overlay for a specific group.
   */
  getOverlays(overlayGroupUid) {
    return this.map.getOverlays().getArray().filter((overlay) => getOlcVirtualGroupUid(overlay) === overlayGroupUid);
  }
  /**
   * Clear from the map all existing overlays from a group.
   */
  clearOverlaysByGroupId(overlayGroupUid) {
    this.map.getOverlays().getArray().filter((overlay) => getOlcVirtualGroupUid(overlay) === overlayGroupUid).forEach((overlay) => this.map.removeOverlay(overlay));
  }
  /**
   * Set z-index of an overlay.
   * @static
   */
  static setOverlayZindex(overlay, zIndex) {
    const element = overlay.getElement()?.parentElement;
    if (element) {
      element.style.zIndex = `${zIndex}`;
    }
  }
}
class MapEntry {
  olcMap;
  olcView;
  olcBackgroundLayer;
  olcOverlayLayer;
  olcOverlayLayerTop;
  olcOverlay;
  olcDrawInteractionGroup;
  olcModifyInteractionGroup;
  /**
   * Create and set up the map.
   */
  constructor() {
    this.olcMap = new Map(Map.createEmptyMap());
    this.olcView = new View(this.olcMap.getMap());
    this.olcBackgroundLayer = new BackgroundLayerGroup(this.olcMap.getMap());
    this.olcOverlayLayer = new OverlayLayerGroup(this.olcMap.getMap());
    this.olcOverlayLayerTop = new OverlayLayerGroup(this.olcMap.getMap(), {
      position: 19,
      // a new position (default is 20 for overlayLayerGroup), to be always on top of the others.
      groupUid: "__olcOverlayLayerTop__"
    });
    this.olcOverlay = new Overlay(this.olcMap.getMap());
    this.olcDrawInteractionGroup = new InteractionGroup(
      this.olcMap.getMap(),
      "__interaction_group_draw__"
    );
    this.olcModifyInteractionGroup = new InteractionGroup(
      this.olcMap.getMap(),
      "__interaction_group_modify__"
    );
  }
  /**
   * @returns the map.
   */
  getOlcMap() {
    return this.olcMap;
  }
  /**
   * @returns the ol-comfy utils view.
   */
  getOlcView() {
    return this.olcView;
  }
  /**
   * @returns the ol-comfy utils background layer.
   */
  getOlcBackgroundLayer() {
    return this.olcBackgroundLayer;
  }
  /**
   * @returns the ol-comfy utils overlay layer.
   */
  getOlcOverlayLayer() {
    return this.olcOverlayLayer;
  }
  /**
   * @returns the ol-comfy utils overlay layer.
   */
  getOlcOverlayLayerTop() {
    return this.olcOverlayLayerTop;
  }
  /**
   * @returns the ol-comfy utils overlay (popup).
   */
  getOlcOverlay() {
    return this.olcOverlay;
  }
  /**
   * @returns the ol-comfy interaction-group to draw features.
   */
  getOlcDrawInteractionGroup() {
    return this.olcDrawInteractionGroup;
  }
  /**
   * @returns the ol-comfy interaction-group to modify features.
   */
  getOlcModifyInteractionGroup() {
    return this.olcModifyInteractionGroup;
  }
}
const DEFAULT_STORE_ID = "__default_store_id__";
class StoreManager {
  stores = {};
  getMapEntry(storesId) {
    const storesIdToUse = storesId ?? DEFAULT_STORE_ID;
    this.maybeCreateStores(storesIdToUse);
    return this.stores[storesIdToUse].mapEntry;
  }
  destroyStores(storesId) {
    delete this.stores[storesId ?? DEFAULT_STORE_ID];
  }
  /**
   * Create every store if the storesId key doesn't have any store.
   * @param storesId
   * @private
   */
  maybeCreateStores(storesId) {
    const storesIdToUse = storesId ?? DEFAULT_STORE_ID;
    if (this.stores[storesIdToUse]) {
      return;
    }
    this.stores[storesIdToUse] = {};
    this.stores[storesIdToUse].mapEntry = new MapEntry();
  }
}
const storeManager = new StoreManager();
export {
  storeManager as s
};
