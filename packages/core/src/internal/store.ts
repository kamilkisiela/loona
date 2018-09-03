export class Store<T> {
  store: Map<string, T>;

  constructor(data: Record<string, T> = {}) {
    this.store = new Map(Object.entries(data));
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  forEach(fn: (value: T, key: string) => void) {
    this.store.forEach(fn);
  }
}
