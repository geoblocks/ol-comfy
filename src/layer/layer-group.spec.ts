import { beforeEach, describe, expect, it } from 'vitest';
import OlLayerBase from 'ol/layer/Base.js';
import BaseLayer from 'ol/layer/Base.js';
import OlLayerLayer from 'ol/layer/Layer.js';
import OlSourceSource from 'ol/source/Source.js';
import { Map } from '../map/map.js';
import { LayerGroup } from './layer-group.js';
import { getLayerGroup } from '../test/test-data.js';
import { BackgroundLayerGroup } from './background-layer-group.js';
import { CollectionEvent } from 'ol/Collection.js';
import { olcUidKey } from '../uid.js';

describe('LayersStore', () => {
  let layerGroup: LayerGroup;
  let baseLayer: OlLayerBase;
  beforeEach(() => {
    // Use one backgroundLayer to test LayerGroup (parent).
    layerGroup = new BackgroundLayerGroup(Map.createEmptyMap());
    baseLayer = new OlLayerBase({});
  });

  it('should addLayer', () =>
    new Promise((done) => {
      layerGroup
        .getLayerGroup()
        .getLayers()
        .on('add', (evt: CollectionEvent<BaseLayer>) => {
          expect(evt.element).toEqual(baseLayer);
          done('Done');
        });
      layerGroup.addLayer(baseLayer, 'myLayer');
      expect(getLayerGroup(layerGroup, 0).getLayers().getLength()).toEqual(1);
    }));

  it('should clearAll', () => {
    layerGroup.addLayer(baseLayer, 'myLayer');
    expect(getLayerGroup(layerGroup, 0).getLayers().getLength()).toEqual(1);
    layerGroup.clearAll();
    expect(getLayerGroup(layerGroup, 0).getLayers().getLength()).toEqual(0);
  });

  it('should fail addLayer', () => {
    const group = getLayerGroup(layerGroup, 0).getLayers().getArray();
    layerGroup.addLayer(baseLayer, 'myLayer');
    expect(group.length).toEqual(1);
    // Same layerUid => fail
    layerGroup.addLayer(baseLayer, 'myLayer');
    expect(group.length).toEqual(1);
    // Invalid empty name => fail
    layerGroup.addLayer(baseLayer, '');
    expect(group.length).toEqual(1);
    // @ts-expect-error Could happen on runtime
    layerGroup.addLayer(null, 'anotherLayer');
    expect(group.length).toEqual(1);
  });

  it('should getAllSources', () => {
    const layerWithSource = new OlLayerLayer({
      source: new OlSourceSource({}),
    });
    layerGroup.addLayer(baseLayer, 'myLayer1');
    layerGroup.addLayer(layerWithSource, 'myLayer2');
    expect(layerGroup.getLayerGroup().getLayers().getLength()).toEqual(2);
    expect(layerGroup.getAllSources().length).toEqual(1);
  });

  it('should setLayerProperty', () =>
    new Promise((done) => {
      const layerUid = 'my-layer';
      const propKey = 'test';
      layerGroup.layerPropertyChanged.subscribe((evt) => {
        expect(evt[olcUidKey]).toBe(layerUid);
        expect(evt.propertyKey).toEqual(propKey);
        expect(layerGroup.getLayer(layerUid)?.get(propKey)).toEqual('success');
        done('Done');
      });
      baseLayer.set(propKey, 'init');
      layerGroup.setLayerProperty(layerUid, propKey, 'no-layer');
      expect(baseLayer.get(propKey)).toEqual('init');
      layerGroup.addLayer(baseLayer, layerUid);
      layerGroup.setLayerProperty(layerUid, propKey, 'success');
    }));

  it('should emitLayerAffected', () =>
    new Promise((done) => {
      const layerUid = 'my-layer';
      const reason = 'targeted';
      layerGroup.layerAffected.subscribe((evt) => {
        expect(evt[olcUidKey]).toBe(layerUid);
        expect(evt.reason).toBe(reason);
        done('Done');
      });
      layerGroup.emitLayerAffected(layerUid, reason);
    }));

  it('should getAttributions', () => {
    const createLayer = (attribution: string) =>
      new OlLayerLayer({
        source: new OlSourceSource({ attributions: attribution }),
      });
    const layers = [
      createLayer('attr1'),
      createLayer('attr2'),
      createLayer('attr3'),
      createLayer('attr1'),
    ];
    layers[2]!.setVisible(false);
    layers.forEach((layer, index) => layerGroup.addLayer(layer, `${index}`));
    expect(layerGroup.getAttributions()).toEqual(['attr1', 'attr2']);
  });
});
