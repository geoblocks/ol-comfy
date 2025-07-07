import OlInteractionSnap, { type Options as SnapOptions } from 'ol/interaction/Snap.js';
import type { InteractionGroup } from './interactionGroup.js';
import { Interaction } from './Interaction.js';

/**
 * Base class to manage OL Snap interactions.
 */
export class Snap extends Interaction {
  constructor(
    interactionGroup: InteractionGroup,
    interactionUid: string,
    options: SnapOptions,
  ) {
    super(interactionGroup, interactionUid);
    this.createInteraction(options);
  }

  /**
   * @returns the interaction.
   */
  getInteraction(): OlInteractionSnap | undefined {
    return this.interactionGroup.find(this.interactionUid) as
      | OlInteractionSnap
      | undefined;
  }

  /**
   * Instantiate a new interaction.
   * @private
   */
  private createInteraction(options: SnapOptions) {
    let interaction = this.interactionGroup.find(this.interactionUid);
    if (!interaction) {
      interaction = new OlInteractionSnap(options);
      this.interactionGroup.add(this.interactionUid, interaction);
    }
  }
}
