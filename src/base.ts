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

/**
 * Find an object with a specific key and value.
 */
export const findObject = <T extends OlBaseObject>(
  objects: T[],
  key: string,
  value: unknown,
): T | null => {
  return objects.find((obj) => obj.get(key) === value) ?? null;
};

/**
 * Filter objects by a specific key and value.
 */
export const filterObjects = <T extends OlBaseObject>(
  objects: T[],
  key: string,
  value: unknown,
): T[] => {
  return objects.filter((obj) => obj.get(key) === value);
};

/**
 * Filter objects by a specific key and value, where the value starts with the given string.
 */
export const filterObjectsStartsWith = <T extends OlBaseObject>(
  objects: T[],
  key: string,
  value: unknown,
): T[] => {
  return objects.filter((obj) => obj.get(key)?.startsWith(value));
};
