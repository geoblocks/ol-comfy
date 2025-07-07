import OlInteractionTranslate, {
  type Options as TranslateOptions,
} from 'ol/interaction/Translate.js';
import { Interaction } from './Interaction.js';
import type { InteractionGroup } from './interactionGroup.js';

/**
 * Base class to manage OL Translate interactions.
 */
export class Translate extends Interaction {
  constructor(
    interactionGroup: InteractionGroup,
    interactionUid: string,
    options: TranslateOptions,
  ) {
    super(interactionGroup, interactionUid);
    this.createInteraction(options);
  }

  /**
   * @returns the interaction.
   */
  getInteraction(): OlInteractionTranslate | undefined {
    return this.interactionGroup.find(this.interactionUid) as
      | OlInteractionTranslate
      | undefined;
  }

  /**
   * Instantiate a new interaction.
   * @private
   */
  private createInteraction(options: TranslateOptions) {
    let interaction = this.interactionGroup.find(this.interactionUid);
    if (!interaction) {
      interaction = new OlInteractionTranslate(options);
      this.interactionGroup.add(this.interactionUid, interaction);
    }
  }
}
