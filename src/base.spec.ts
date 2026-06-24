import { describe, it, expect, beforeEach } from 'vitest';
import OlBaseObject from 'ol/Object.js';
import {
  getSortedOlObjectsByProperty,
  findObject,
  filterObjects,
  filterObjectsStartsWith,
} from './base.js';

describe('base', () => {
  let objects: OlBaseObject[];

  beforeEach(() => {
    objects = [
      new OlBaseObject({ prop1: 'albi', prop2: 3 }),
      new OlBaseObject({ prop1: 'ca_co', prop2: -1 }),
      new OlBaseObject({ prop1: 'ca_co', prop2: 4 }),
      new OlBaseObject({ prop1: 'cz_ci', prop2: 5 }),
      new OlBaseObject({ prop1: 'dori', prop2: 10 }),
      new OlBaseObject({ prop1: '0', prop2: NaN }),
    ];
  });

  it('getSortedOlObjectsByProperty', () => {
    let sorted = getSortedOlObjectsByProperty(objects, 'prop1');
    expect(sorted.map((obj) => obj.get('prop1'))).toEqual([
      '0',
      'albi',
      'ca_co',
      'ca_co',
      'cz_ci',
      'dori',
    ]);
    sorted = getSortedOlObjectsByProperty(objects, 'prop2');
    expect(sorted.map((obj) => obj.get('prop2'))).toEqual([NaN, -1, 3, 4, 5, 10]);
  });

  it('findObject', () => {
    expect(findObject(objects, 'prop1', 'ca_co')).toBe(objects[1]);
    expect(findObject(objects, 'prop2', 4)).toBe(objects[2]);
    expect(findObject(objects, 'prop2', 10)).toBe(objects[4]);
    expect(findObject(objects, 'prop1', 'x')).toBeNull();
  });

  it('filterObjects', () => {
    expect(filterObjects(objects, 'prop1', 'ca_co').length).toEqual(2);
    expect(filterObjects(objects, 'prop2', 4)).toEqual([objects[2]]);
    expect(filterObjects(objects, 'prop2', 10)).toEqual([objects[4]]);
    expect(filterObjects(objects, 'prop1', 'x')).toEqual([]);
  });

  it('filterObjectsStartsWith', () => {
    expect(filterObjectsStartsWith(objects, 'prop1', 'ca').length).toEqual(2);
    expect(filterObjectsStartsWith(objects, 'prop1', 'c').length).toEqual(3);
    expect(filterObjectsStartsWith(objects, 'prop1', 'cz')).toEqual([objects[3]]);
    expect(filterObjectsStartsWith(objects, 'prop1', 'x')).toEqual([]);
  });
});
