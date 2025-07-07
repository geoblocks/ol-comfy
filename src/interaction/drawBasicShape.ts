import OlInteractionDraw, { type Options } from 'ol/interaction/Draw.js';
import OlSourceVector from 'ol/source/Vector.js';
import { never } from 'ol/events/condition.js';
import type OlFeature from 'ol/Feature.js';
import type { InteractionGroup } from './interactionGroup.js';
import { Interaction } from './Interaction.js';

/**
 * Manage "shape" drawing interaction on an OpenLayers map.
 */
export class DrawBasicShape extends Interaction {
  constructor(
    interactionGroup: InteractionGroup,
    interactionUid: string,
    options: Options,
  ) {
    super(interactionGroup, interactionUid);
    this.createInteraction(options);
  }

  /**
   * Instantiate a new interaction.
   * @private
   */
  private createInteraction(options: Options) {
    let interaction = this.interactionGroup.find(this.interactionUid);
    if (!interaction) {
      interaction = new OlInteractionDraw(options);
      this.interactionGroup.add(this.interactionUid, interaction);
    }
  }

  /**
   * @returns the interactions.
   */
  getInteraction(): OlInteractionDraw | undefined {
    return this.interactionGroup.find(this.interactionUid) as
      | OlInteractionDraw
      | undefined;
  }

  /**
   * Get defaults configured Drawing options to draw polygons.
   * @static
   */
  static getDefaultPolygonOptions(source: OlSourceVector<OlFeature>): Options {
    return {
      freehandCondition: never,
      source,
      type: 'Polygon',
    };
  }

  /**
   * Get defaults configured Drawing options to draw circles.
   * @static
   */
  static getDefaultCircleOptions(source: OlSourceVector<OlFeature>): Options {
    return {
      source,
      type: 'Circle',
    };
  }

  /**
   * Get defaults configured Drawing options to draw lines.
   * @static
   */
  static getDefaultLineOptions(source: OlSourceVector<OlFeature>): Options {
    return {
      freehandCondition: never,
      source,
      type: 'LineString',
    };
  }

  /**
   * Get defaults configured Drawing options to draw points.
   * @static
   */
  static getDefaultPointOptions(source: OlSourceVector<OlFeature>): Options {
    return {
      source,
      type: 'Point',
    };
  }
}
