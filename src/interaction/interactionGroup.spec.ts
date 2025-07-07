import { describe, it, expect, beforeEach } from 'vitest';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {
  DefaultGroupUid,
  InteractionGroup,
  InteractionGroupUidKey,
} from './interactionGroup.js';
import Draw from 'ol/interaction/Draw.js';
import VectorSource from 'ol/source/Vector.js';

describe('Interaction', () => {
  let map: Map;
  let interactionGroup: InteractionGroup;
  let drawInteraction: Draw;
  const drawInteractionUid = 'draw';

  beforeEach(() => {
    map = new Map({ view: new View({ center: [0, 0], zoom: 1 }), interactions: [] });
    interactionGroup = new InteractionGroup(map);
    drawInteraction = new Draw({ source: new VectorSource(), type: 'Point' });
  });

  it('should getGroupInteractions', () => {
    interactionGroup.add(drawInteractionUid, drawInteraction);
    const group = interactionGroup.getGroupInteractions();
    expect(group.length).toEqual(1);
    expect(group[0]!.get(InteractionGroupUidKey)).toBe(DefaultGroupUid);
    // With a second group:
    const group2Uid = 'group2';
    const interactionGroup2 = new InteractionGroup(map, group2Uid);
    const drawInteraction2 = new Draw({ source: new VectorSource(), type: 'Point' });
    interactionGroup2.add(drawInteractionUid, drawInteraction2);
    const group2 = interactionGroup2.getGroupInteractions();
    expect(group.length).toEqual(1); // still 1
    expect(group2.length).toEqual(1);
    expect(group2[0]!.get(InteractionGroupUidKey)).toBe(group2Uid);
  });

  it('should add an interaction to the map', () => {
    interactionGroup.add(drawInteractionUid, drawInteraction);
    const found = interactionGroup.find(drawInteractionUid);
    expect(found).toBe(drawInteraction);
  });

  it('should not add the same interaction twice', () => {
    interactionGroup.add(drawInteractionUid, drawInteraction);
    const countBefore = map.getInteractions().getLength();
    interactionGroup.add(drawInteractionUid, drawInteraction);
    const countAfter = map.getInteractions().getLength();
    expect(countAfter).toBe(countBefore);
  });

  it('should find an interaction by uid', () => {
    interactionGroup.add(drawInteractionUid, drawInteraction);
    const found = interactionGroup.find(drawInteractionUid);
    expect(found).toBe(drawInteraction);
  });

  it('should find interactions including a uidPart', () => {
    const drawInteraction2 = new Draw({ source: new VectorSource(), type: 'Point' });
    const drawInteraction3 = new Draw({ source: new VectorSource(), type: 'Point' });
    const drawInteraction4 = new Draw({ source: new VectorSource(), type: 'Point' });
    interactionGroup.add('test_draw-1-a', drawInteraction);
    interactionGroup.add('d-raw', drawInteraction2);
    interactionGroup.add('draw-2-b', drawInteraction3);
    interactionGroup.add('test_draw', drawInteraction4);
    const found = interactionGroup.findByIncluding('draw');
    // Every item matches except one.
    expect(found.length).toBe(3);
  });

  it('should remove an interaction by uid', () => {
    interactionGroup.add(drawInteractionUid, drawInteraction);
    interactionGroup.remove(drawInteractionUid);
    const found = interactionGroup.find(drawInteractionUid);
    expect(found).toBeUndefined();
  });

  it('should check if an interaction exists', () => {
    expect(interactionGroup.hasInteraction(drawInteractionUid)).toBe(false);
    interactionGroup.add(drawInteractionUid, drawInteraction);
    expect(interactionGroup.hasInteraction(drawInteractionUid)).toBe(true);
  });

  it('should activate/deactivate interactions', () => {
    const drawInteraction2 = new Draw({ source: new VectorSource(), type: 'Point' });
    const drawInteraction3 = new Draw({ source: new VectorSource(), type: 'Point' });
    const group2Uid = 'group2';
    const interactionGroup2 = new InteractionGroup(map, group2Uid);
    interactionGroup.add('draw-1', drawInteraction);
    interactionGroup.add('draw-2', drawInteraction2);
    interactionGroup2.add('draw-1', drawInteraction3);
    drawInteraction.setActive(true);
    drawInteraction2.setActive(true);
    drawInteraction3.setActive(true);
    // Active the first (already active, toggle the others off)
    interactionGroup.setActive(true, 'draw-1');
    expect(drawInteraction.getActive()).toBeTruthy();
    expect(drawInteraction2.getActive()).toBeFalsy();
    expect(drawInteraction3.getActive()).toBeTruthy(); // Second group, untouched.
    // Active the second (toggle the others off)
    interactionGroup.setActive(true, 'draw-2');
    expect(drawInteraction.getActive()).toBeFalsy();
    expect(drawInteraction2.getActive()).toBeTruthy();
    expect(drawInteraction3.getActive()).toBeTruthy(); // Second group, untouched.
    // Deactivate the first (don't touch the others)
    interactionGroup.setActive(false, 'draw-1');
    expect(drawInteraction.getActive()).toBeFalsy();
    expect(drawInteraction2.getActive()).toBeTruthy();
    expect(drawInteraction3.getActive()).toBeTruthy(); // Second group, untouched.
    // Deactivate the second (don't touch the others)
    interactionGroup.setActive(false, 'draw-2');
    expect(drawInteraction.getActive()).toBeFalsy();
    expect(drawInteraction2.getActive()).toBeFalsy();
    expect(drawInteraction3.getActive()).toBeTruthy(); // Second group, untouched.
  });

  it('should destroy interactions', () => {
    interactionGroup.add(drawInteractionUid, drawInteraction);
    expect(drawInteraction.getActive()).toBeTruthy();
    expect(map.getInteractions().getLength()).toEqual(1);
    interactionGroup.destroy();
    expect(drawInteraction.getActive()).toBeFalsy();
    expect(map.getInteractions().getLength()).toEqual(0);
  });
});
