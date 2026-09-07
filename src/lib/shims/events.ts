/**
 * Self-contained browser shim for Node's `events` module.
 *
 * The client build stubs Node builtins to an empty object, so WalletConnect's
 * `new events.EventEmitter()` threw "Ie.EventEmitter is not a constructor" in
 * production. This shim provides a Node-compatible EventEmitter and exposes it
 * through every import shape those libraries use (default, named, namespace).
 */
type Listener = (...args: unknown[]) => void;

interface Entry {
  fn: Listener;
  once: boolean;
}

export class EventEmitter {
  private _events: Map<string | symbol, Entry[]> = new Map();
  private _maxListeners = 0;

  private _add(event: string | symbol, fn: Listener, once: boolean, prepend: boolean) {
    const list = this._events.get(event) ?? [];
    const entry: Entry = { fn, once };
    if (prepend) list.unshift(entry);
    else list.push(entry);
    this._events.set(event, list);
    return this;
  }

  addListener(event: string | symbol, fn: Listener) {
    return this._add(event, fn, false, false);
  }

  on(event: string | symbol, fn: Listener) {
    return this._add(event, fn, false, false);
  }

  once(event: string | symbol, fn: Listener) {
    return this._add(event, fn, true, false);
  }

  prependListener(event: string | symbol, fn: Listener) {
    return this._add(event, fn, false, true);
  }

  prependOnceListener(event: string | symbol, fn: Listener) {
    return this._add(event, fn, true, true);
  }

  removeListener(event: string | symbol, fn: Listener) {
    const list = this._events.get(event);
    if (!list) return this;
    const next = list.filter((entry) => entry.fn !== fn);
    if (next.length) this._events.set(event, next);
    else this._events.delete(event);
    return this;
  }

  off(event: string | symbol, fn: Listener) {
    return this.removeListener(event, fn);
  }

  removeAllListeners(event?: string | symbol) {
    if (event === undefined) this._events.clear();
    else this._events.delete(event);
    return this;
  }

  emit(event: string | symbol, ...args: unknown[]) {
    const list = this._events.get(event);
    if (!list || list.length === 0) return false;
    for (const entry of [...list]) {
      if (entry.once) this.removeListener(event, entry.fn);
      entry.fn.apply(this, args);
    }
    return true;
  }

  listeners(event: string | symbol) {
    return (this._events.get(event) ?? []).map((entry) => entry.fn);
  }

  rawListeners(event: string | symbol) {
    return this.listeners(event);
  }

  listenerCount(event: string | symbol) {
    return (this._events.get(event) ?? []).length;
  }

  eventNames() {
    return [...this._events.keys()];
  }

  setMaxListeners(n: number) {
    this._maxListeners = n;
    return this;
  }

  getMaxListeners() {
    return this._maxListeners;
  }
}

export function once(emitter: EventEmitter, event: string | symbol): Promise<unknown[]> {
  return new Promise((resolve) => {
    emitter.once(event, (...args: unknown[]) => resolve(args));
  });
}

export const EventEmitterAsyncResource = EventEmitter;
export const defaultMaxListeners = 10;

// Some bundles read `events.default.EventEmitter` or call the module as a class.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(EventEmitter as any).EventEmitter = EventEmitter;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(EventEmitter as any).default = EventEmitter;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(EventEmitter as any).once = once;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(EventEmitter as any).defaultMaxListeners = defaultMaxListeners;

export default EventEmitter;
