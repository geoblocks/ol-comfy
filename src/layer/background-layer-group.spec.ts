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
      let countEvent = 0;
      bgGroup.on(LayerPropertyChangedEventType, (evt: LayerPropertyChangedEvent) => {
        if (evt[olcUidKey] === 'firstLayer') {
          countEvent++;
          expect(evt.propertyKey).toEqual('visible');
        }
        if (evt[olcUidKey] === 'secondLayer') {
          countEvent++;
          expect(expectedGroup[1]!.getVisible()).toBeTruthy();
          expect(evt.propertyKey).toEqual('visible');
          expect(countEvent).toEqual(2);
          done('Done');
        }
      });
      bgGroup.toggleVisible('secondLayer');
    }));

  it('should toggleVisible all off', async () =>
    new Promise((done) => {
      const secondLayer = new OlLayerBase({});
      const expectedGroup = getLayerGroup(bgGroup, 0).getLayers().getArray();
      baseLayer.setVisible(false);
      secondLayer.setVisible(true);
      bgGroup.addLayer(baseLayer, 'firstLayer');
      bgGroup.addLayer(secondLayer, 'secondLayer');
      expect(expectedGroup.length).toEqual(2);
      // Wait the events to execute this final async test
      let countEvent = 0;
      bgGroup.on(LayerPropertyChangedEventType, (evt: LayerPropertyChangedEvent) => {
        countEvent++;
        expect(evt.propertyKey).toEqual('visible');
        if (evt[olcUidKey] === 'secondLayer') {
          expect(expectedGroup[0]!.getVisible()).toBeFalsy();
          expect(expectedGroup[1]!.getVisible()).toBeFalsy();
          expect(countEvent).toEqual(1);
          done('Done');
        }
      });
      expect(expectedGroup[1]!.getVisible()).toBeTruthy();
      bgGroup.toggleVisible('not-existing-layer');
      expect(expectedGroup[1]!.getVisible()).toBeFalsy();
    }));
});
