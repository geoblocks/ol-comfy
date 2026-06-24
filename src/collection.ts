import OlCollection from 'ol/Collection.js';
import OlBaseObject from 'ol/Object.js';

/**
 * Insert an object at a specific position, keeping the order.
 */
export const insertAtKeepOrder = <T extends OlBaseObject>(
  objects: OlCollection<T>,
  object: T,
  orderKey: string,
  position: number,
) => {
  object.set(orderKey, position);
  let nearestUpperIndex = objects
    .getArray()
    .findIndex((obj) => (obj.get(orderKey) ?? 0) >= position);
  if (nearestUpperIndex < 0) {
    nearestUpperIndex = objects.getLength();
  }
  objects.insertAt(nearestUpperIndex, object);
};
