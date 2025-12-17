import { MapEntry } from './map-entry.js';

interface Store {
  mapEntry?: MapEntry;
  // you can add other stores here if you need them.
}

export const DEFAULT_STORE_ID = '__default_store_id__';

/**
 * An instance that creates, provide, and delete store.
 * Exposed as a singleton, it allows you to easily manage all of your stores.
 */
export class StoreManager {
  private stores: { [key: string]: Store } = {};

  getMapEntry(storesId?: string): MapEntry {
    const storesIdToUse = storesId ?? DEFAULT_STORE_ID;
    this.maybeCreateStores(storesIdToUse);
    return this.stores[storesIdToUse]!.mapEntry as MapEntry;
  }

  destroyStores(storesId?: string) {
    delete this.stores[storesId ?? DEFAULT_STORE_ID];
  }

  /**
   * Create every store if the storesId key doesn't have any store.
   * @param storesId
   * @private
   */
  private maybeCreateStores(storesId?: string) {
    const storesIdToUse = storesId ?? DEFAULT_STORE_ID;
    if (this.stores[storesIdToUse]) {
      return;
    }
    this.stores[storesIdToUse] = {};
    this.stores[storesIdToUse].mapEntry = new MapEntry();
  }
}

// Expose it as singleton.
const storeManager = new StoreManager();
export default storeManager;
