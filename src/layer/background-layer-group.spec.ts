import { beforeEach, describe, expect, it } from 'vitest';
import OlLayerBase from 'ol/layer/Base.js';
import { BackgroundLayerGroup } from './background-layer-group.js';
import { Map } from '../map/map.js';
import { getLayerGroup } from '../test/test-data.js';
import {
  LayerPropertyChangedEvent,
  LayerPropertyChangedEventType,
} from './layer-group.js';
import { olcUidKey } from '../uid.js';

describe('BackgroundLayerGroup', () => {
  let bgGroup: BackgroundLayerGroup;
  let baseLayer: OlLayerBase;
  beforeEach(() => {
    bgGroup = new BackgroundLayerGroup(Map.createEmptyMap());
    baseLayer = new OlLayerBase({});
  });

  it('should getFirstVisible', () => {
    const secondLayer = new OlLayerBase({});
    bgGroup.addLayer(baseLayer, 'firstLayer');
    bgGroup.addLayer(secondLayer, 'secondLayer');
    baseLayer.setVisible(true);
    expect(bgGroup.getFirstVisible()).toBe(baseLayer);
    secondLayer.setVisible(true);
    expect(bgGroup.getFirstVisible()).toBe(baseLayer);
    baseLayer.setVisible(false);
    expect(bgGroup.getFirstVisible()).toBe(secondLayer);
  });

  it('should toggleVisible', async () =>
    new Promise((done) => {
      const secondLayer = new OlLayerBase({});
      const expectedGroup = getLayerGroup(bgGroup, 0).getLayers().getArray();
      bgGroup.addLayer(baseLayer, 'firstLayer');
      bgGroup.addLayer(secondLayer, 'secondLayer');
      expect(expectedGroup.length).toEqual(2);
      bgGroup.toggleVisible('secondLayer');
      expect(expectedGroup[0]!.getVisible()).toBeFalsy();
      expect(expectedGroup[1]!.getVisible()).toBeTruthy();
      bgGroup.toggleVisible('firstLayer');
      expect(expectedGroup[0]!.getVisible()).toBeTruthy();
      expect(expectedGroup[1]!.getVisible()).toBeFalsy();
      // Wait the events to execute this final async test
      bgGroup.once(LayerPropertyChangedEventType, (evt: LayerPropertyChangedEvent) => {
        expect(evt.propertyKey).toEqual('visible');
        expect(evt[olcUidKey]).toEqual('secondLayer');
        expect(expectedGroup[1]!.getVisible()).toBeTruthy();
        done('Done');
      });
      bgGroup.toggleVisible('secondLayer');
    }));
});
