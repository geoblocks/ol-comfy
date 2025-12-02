import { describe, it, expect } from 'vitest';
import { createDummyFeatures } from '../test/test-data.js';
import {
  getDistinctFeaturesProperties,
  getFeaturesExtent,
  getLinesBetweenPoints,
} from './utils.js';
import OlGeomPoint from 'ol/geom/Point.js';
import OlGeomLine from 'ol/geom/LineString.js';
import OlFeature from 'ol/Feature.js';

describe('feature utils', () => {
  it('getDistinctFeaturesProperties', () => {
    const features = createDummyFeatures(3).map((feature, index) => {
      feature.set('prop1', index);
      feature.set('prop2', 'test');
      return feature;
    });
    expect(getDistinctFeaturesProperties(features, 'prop1')).toEqual([0, 1, 2]);
    expect(getDistinctFeaturesProperties(features, 'prop2')).toEqual(['test']);
  });

  it('getLinesBetweenPoints', () => {
    const features = createDummyFeatures(3).map((feature, index) => {
      feature.set('index', index);
      return feature;
    });
    expect(getLinesBetweenPoints(features).length).toEqual(2);
    // With callback.
    const callback = (
      line: OlFeature<OlGeomLine>,
      startPoint: OlFeature<OlGeomPoint>,
      endPoint: OlFeature<OlGeomPoint>,
    ) => {
      line.set('from', startPoint.get('index'));
      line.set('to', endPoint.get('index'));
    };
    const result = getLinesBetweenPoints(features, callback);
    expect(result.length).toEqual(2);
    expect(result[0]?.get('from')).toEqual(0);
    expect(result[0]?.get('to')).toEqual(1);
    expect(result[1]?.get('from')).toEqual(1);
    expect(result[1]?.get('to')).toEqual(2);
  });

  it('getFeaturesExtent', () => {
    const features = createDummyFeatures(3);
    expect(getFeaturesExtent(features)).toEqual([828000, 5932736, 828200, 5932736]);
    expect(getFeaturesExtent([])).toEqual(null);
  });
});
