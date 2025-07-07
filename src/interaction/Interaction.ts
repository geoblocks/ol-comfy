import type { InteractionGroup } from './interactionGroup.js';

/**
 * Abstract Interaction for Interaction Group.
 */
export abstract class Interaction {
  protected readonly interactionGroup: InteractionGroup;
  protected readonly interactionUid: string;

  protected constructor(interactionGroup: InteractionGroup, interactionUid: string) {
    this.interactionGroup = interactionGroup;
    this.interactionUid = interactionUid;
  }

  /**
   * Remove the interaction from the map.
   */
  destroy() {
    this.interactionGroup.remove(this.interactionUid);
  }
}
