import OlMap from 'ol/Map.js';
import OlInteractionDraw from 'ol/interaction/Draw.js';

/** Uid property key for the draw interaction. */
export const DrawInteractionUidKey = 'olcInteractionDrawUid';
/** Part of the draw interaction uid. */
export const DrawInteractionUid = 'olcInteractionDrawUid';
/** Group prop. key for the draw interaction. To identify such interaction. */
export const DrawInteractionGroupKey = 'olcInteractionDrawGroup';
/** Group prop. value for the draw interaction. To identify such interaction. */
export const DrawInteractionGroupValue = 'olcStandardDraw';

/**
 * Parent class able to enable drawing on an OpenLayers Map.
 * Manage interactions - create, allow only one draw active at a time,
 * destroy - and let possible find back interactions to add listener on them.
 */
export class Draw {
  // @ts-expect-error This is handled by children classes.
  protected interaction: OlInteractionDraw;

  constructor(
    protected map: OlMap,
    uid: string,
  ) {
    const interaction = this.getDrawInteraction(uid);
    if (interaction) {
      this.interaction = interaction;
    }
  }

  /**
   * Remove the interaction from the map.
   */
  destroy() {
    this.map.removeInteraction(this.interaction);
  }

  /**
   * @returns the uid of the interaction.
   */
  getFullUid(uid: string): string {
    return `${DrawInteractionUid}-${uid}`;
  }

  /**
   * @returns the interaction.
   */
  getInteraction(): OlInteractionDraw {
    return this.interaction;
  }

  /**
   * Activate the interaction (and deactivate other draw interactions) or
   * deactivate it.
   */
  setActive(active: boolean) {
    if (active) {
      this.use(this.interaction);
    } else {
      this.interaction.setActive(false);
    }
  }

  /**
   * Add a (deactivated) interaction on the map.
   * @protected
   */
  protected registerInteraction(interaction: OlInteractionDraw, uid: string) {
    interaction.set(DrawInteractionGroupKey, DrawInteractionGroupValue);
    interaction.set(DrawInteractionUidKey, this.getFullUid(uid));
    interaction.setActive(false);
    this.map.addInteraction(interaction);
  }

  /**
   * Deactivate all draw interaction and activate the given one.
   * @protected
   */
  protected use(interactionToUse: OlInteractionDraw) {
    this.deactivateAll();
    interactionToUse.setActive(true);
  }

  /**
   * Deactivate all draw interaction.
   * @protected
   */
  protected deactivateAll() {
    this.getDrawInteractions().forEach((interaction) => interaction.setActive(false));
  }

  /**
   * @returns draw interaction based on its uid.
   * @protected
   */
  protected getDrawInteraction(uid: string): OlInteractionDraw | undefined {
    return this.map
      .getInteractions()
      .getArray()
      .find(
        (interaction) => interaction.get(DrawInteractionUidKey) === this.getFullUid(uid),
      ) as OlInteractionDraw | undefined;
  }

  /**
   * @returns Every draw interactions managed by this class, meaning with the
   * "DrawInteractionGroupKey" property key set.
   * @protected
   */
  protected getDrawInteractions(): OlInteractionDraw[] {
    return this.map
      .getInteractions()
      .getArray()
      .filter(
        (interaction) => !!interaction.get(DrawInteractionGroupKey),
      ) as OlInteractionDraw[];
  }
}
