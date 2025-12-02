import { type EventsKey, listen } from 'ol/events.js';
import BaseEvent from 'ol/events/Event.js';
import { unByKey } from 'ol/Observable.js';

type callback = () => void;

/**
 * Listen keydown/keyup event on document for a specific keyboard key.
 */
export class ListenKey {
  private readonly eventKeys: EventsKey[] = [];
  private keyDown = false;
  private keyDownCallback?: callback;
  private keyUpCallback?: callback;

  /**
   * @param listenedKey the key to listen.
   */
  constructor(private readonly listenedKey: string) {
    this.eventKeys.push(
      listen(document, 'keydown', this.handleKeyDown.bind(this)),
      listen(document, 'keyup', this.handleKeyUp.bind(this)),
    );
  }

  /**
   * Destroy listeners. The instance is then useless.
   */
  destroy() {
    unByKey(this.eventKeys);
  }

  /**
   * Is the key currently pressed.
   */
  isKeyDown(): boolean {
    return this.keyDown;
  }

  /**
   * Register a callback that will be called each time the key is pressed.
   * @param callback
   */
  setOnKeyDown(callback: callback) {
    this.keyDownCallback = callback;
  }

  /**
   * Register a callback that will be called each time the key is released.
   * @param callback
   */
  setOnKeyUp(callback: callback) {
    this.keyUpCallback = callback;
  }

  /**
   * Check if the key is pressed.
   * @private
   */
  private handleKeyDown(evt: Event | BaseEvent) {
    if (evt instanceof KeyboardEvent && evt.key === this.listenedKey) {
      this.keyDown = true;
      if (this.keyDownCallback) {
        this.keyDownCallback();
      }
    }
  }

  /**
   * Check if the key is released.
   * @private
   */
  private handleKeyUp(evt: Event | BaseEvent) {
    if (evt instanceof KeyboardEvent && evt.key === this.listenedKey) {
      this.keyDown = false;
      if (this.keyUpCallback) {
        this.keyUpCallback();
      }
    }
  }
}
