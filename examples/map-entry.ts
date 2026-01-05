import { Map } from '../src/map/map.js';
import { InteractionGroup } from '../src/interaction/interaction-group.js';
import { View } from '../src/view/view.js';
import { BackgroundLayerGroup } from '../src/layer/background-layer-group.js';
import { OverlayLayerGroup } from '../src/layer/overlay-layer-group.js';
import { Overlay } from '../src/overlay/overlay.js';

/**
 * Entry point to the map instance and linked (ol-comfy-utils) classes.
 * Allows setting values and get instances from the map and sub-elements (view,
 * layers, etc.)
 */
export class MapEntry {
  private readonly olcMap: Map;
  private readonly olcView: View;
  private readonly olcBackgroundLayer: BackgroundLayerGroup;
  private readonly olcOverlayLayer: OverlayLayerGroup;
  private readonly olcOverlayLayerTop: OverlayLayerGroup;
  private readonly olcOverlay: Overlay;
  private readonly olcDrawInteractionGroup: InteractionGroup;
  private readonly olcSelectInteractionGroup: InteractionGroup;

  /**
   * Create and set up the map.
   */
  constructor() {
    this.olcMap = new Map(Map.createEmptyMap());
    this.olcView = new View(this.olcMap.getMap());
    this.olcBackgroundLayer = new BackgroundLayerGroup(this.olcMap.getMap());
    this.olcOverlayLayer = new OverlayLayerGroup(this.olcMap.getMap());
    this.olcOverlayLayerTop = new OverlayLayerGroup(this.olcMap.getMap(), {
      position: 19, // a new position (default is 20 for overlayLayerGroup), to be always on top of the others.
      groupUid: '__olcOverlayLayerTop__',
    });
    this.olcOverlay = new Overlay(this.olcMap.getMap());
    this.olcDrawInteractionGroup = new InteractionGroup(
      this.olcMap.getMap(),
      '__interaction_group_draw__',
    );
    this.olcSelectInteractionGroup = new InteractionGroup(
      this.olcMap.getMap(),
      '__interaction_group_select__',
    );
  }

  /**
   * @returns the map.
   */
  getOlcMap(): Map {
    return this.olcMap;
  }

  /**
   * @returns the ol-comfy utils view.
   */
  getOlcView(): View {
    return this.olcView;
  }

  /**
   * @returns the ol-comfy utils background layer.
   */
  getOlcBackgroundLayer(): BackgroundLayerGroup {
    return this.olcBackgroundLayer;
  }

  /**
   * @returns the ol-comfy utils overlay layer.
   */
  getOlcOverlayLayer(): OverlayLayerGroup {
    return this.olcOverlayLayer;
  }

  /**
   * @returns the ol-comfy utils overlay layer.
   */
  getOlcOverlayLayerTop(): OverlayLayerGroup {
    return this.olcOverlayLayerTop;
  }

  /**
   * @returns the ol-comfy utils overlay (popup).
   */
  getOlcOverlay(): Overlay {
    return this.olcOverlay;
  }

  /**
   * @returns the ol-comfy interaction-group.
   */
  getOlcDrawInteractionGroup(): InteractionGroup {
    return this.olcDrawInteractionGroup;
  }

  /**
   * @returns the ol-comfy interaction-group.
   */
  getOlcSelectInteractionGroup(): InteractionGroup {
    return this.olcSelectInteractionGroup;
  }
}
