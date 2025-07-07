import OlInteractionModify, {
  type Options as ModifyOptions,
} from 'ol/interaction/Modify.js';
import type { InteractionGroup } from './interactionGroup.js';
import { Interaction } from './Interaction.js';

/**
 * Base class to manage OL Modify interactions.
 */
export class Modify extends Interaction {
  constructor(
    interactionGroup: InteractionGroup,
    interactionUid: string,
    options: ModifyOptions,
  ) {
    super(interactionGroup, interactionUid);
    this.createInteraction(options);
  }

  /**
   * @returns the interactions.
   */
  getInteraction(): OlInteractionModify | undefined {
    return this.interactionGroup.find(this.interactionUid) as
      | OlInteractionModify
      | undefined;
  }

  /**
   * Instantiate a new interaction.
   * @private
   */
  private createInteraction(options: ModifyOptions) {
    let interaction = this.interactionGroup.find(this.interactionUid);
    if (!interaction) {
      interaction = new OlInteractionModify(options);
      this.interactionGroup.add(this.interactionUid, interaction);
    }
  }
}
