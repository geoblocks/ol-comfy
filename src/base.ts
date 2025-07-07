import OlBaseObject from 'ol/Object.js';

/**
 * Get an OpenLayers object and return it sorted by the given key property.
 */
export const getSortedOlObjectsByProperty = <T extends OlBaseObject>(
  objects: T[],
  propertyKey: string,
): T[] => {
  return objects.slice().sort((object1, object2) => {
    const prop1 = object1.get(propertyKey) ?? '';
    const prop2 = object2.get(propertyKey);
    if (prop1 === prop2) {
      return 0;
    }
    return prop1 > prop2 ? 1 : -1;
  });
};
