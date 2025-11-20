import BaseObject from 'ol/Object.js';

export const olcUidKey = '__olcUid__';
export const olcVirtualGroupUidKey = '__olcVirtualGroupUid__';

/**
 * Get the ol-comfy uid of the given object.
 * An uid is a unique identifier of an object but only unique within the same collection.
 * @returns The ol-comfy uid of the given object.
 */
export const getOlcUid = (baseObject: BaseObject): string | undefined => {
  return baseObject.get(olcUidKey) as string | undefined;
};

/**
 * Get the ol-comfy virtual group uid of the given object.
 * It's called a virtual group because it's not a real collection, it's object sharing the same group uid.
 * @returns The ol-comfy virtual group uid of the given object.
 */
export const getOlcVirtualGroupUid = (baseObject: BaseObject): string | undefined => {
  return baseObject.get(olcVirtualGroupUidKey) as string | undefined;
};
