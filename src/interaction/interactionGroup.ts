import type OlInteraction from 'ol/interaction/Interaction.js';
import OlMap from 'ol/Map.js';

export const InteractionUidKey = 'interactionUid';
export const InteractionGroupUidKey = 'interactionGroupUId';
export const DefaultGroupUid = 'olcInteractionGroup';

/**
 * Manage a virtual group of interaction by setting a group uid in every added interaction.
 * It can add, remove, find interaction, and toggle the active state of interactions.
 */
export class InteractionGroup {
  protected readonly map: OlMap;
  protected groupUid: string;

  constructor(map: OlMap, groupUid?: string) {
    this.map = map;
    this.groupUid = groupUid || DefaultGroupUid;
  }

  /**
   * @returns all the interaction of the wanted group.
   */
  getGroupInteractions(): OlInteraction[] {
    return this.map
      .getInteractions()
      .getArray()
      .filter((interaction) => interaction.get(InteractionGroupUidKey) === this.groupUid);
  }

  /**
   * Adds the given interaction to the given map with an uid.
   * The interaction can't be in multiple groups at the same time.
   * @param uid - The uid to associate with the interaction
   * @param interaction - The interaction to add
   */
  add(uid: string, interaction: OlInteraction): void {
    if (this.hasInteraction(uid)) {
      console.warn(
        `Interaction with uid "${uid}" already exists in group "${this.groupUid}"`,
      );
      return;
    }
    const interactionGroupUid = interaction.get(InteractionGroupUidKey);
    if (interactionGroupUid) {
      console.warn(
        `Interaction with uid "${uid}" already exists in group "${interactionGroupUid}"`,
      );
      return;
    }
    interaction.set(InteractionUidKey, uid);
    interaction.set(InteractionGroupUidKey, this.groupUid);
    this.map.addInteraction(interaction);
  }

  /**
   * Finds an interaction by its uid
   * @param uid - The uid of the interaction to find
   * @returns The interaction if found, undefined otherwise
   */
  find(uid: string): OlInteraction | undefined {
    return this.getGroupInteractions().find((interaction) => {
      return interaction.get(InteractionUidKey) === uid;
    });
  }

  /**
   * Finds all interaction having uid included in the provided uid.
   * @param uidPart - A start part uid of the interaction to find.
   * @returns The interaction if found or undefined otherwise.
   */
  findByIncluding(uidPart: string): OlInteraction[] {
    return this.getGroupInteractions().filter((interaction) => {
      return `${interaction.get(InteractionUidKey)}`.includes(uidPart);
    });
  }

  /**
   * Removes the given interaction from the map.
   * @param uid - The uid of the interaction to remove
   */
  remove(uid: string): void {
    const interaction = this.find(uid);
    if (!interaction) {
      return;
    }
    // Remove the interaction from the map
    interaction.unset(InteractionGroupUidKey);
    this.map.removeInteraction(interaction);
  }

  /**
   * Verifies if the interaction is already present in the map
   * @param uid The uid of the interaction to check
   * @returns boolean indicating if the interaction is present
   */
  hasInteraction(uid: string): boolean {
    return !!this.getGroupInteractions().find(
      (interaction) => interaction.get(InteractionUidKey) === uid,
    );
  }

  /**
   * Activate the interaction (and deactivate other interactions of this group) or
   * deactivate it.
   */
  setActive(active: boolean, uid: string) {
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
    return this.getGroupInteractions().forEach((interaction) =>
      interaction.setActive(false),
    );
  }

  /**
   * Deactivates and remove every interaction of this group.
   */
  destroy() {
    this.deactivateAll();
    this.getGroupInteractions().forEach((interaction) => {
      this.remove(interaction.get(InteractionUidKey));
    });
  }

  /**
   * Deactivate all interaction of this group and activate the given one.
   * @protected
   */
  protected use(interaction: OlInteraction) {
    this.deactivateAll();
    interaction.setActive(true);
  }
}
