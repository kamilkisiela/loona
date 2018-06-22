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

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    return this.store.clear();
  }

  replace(newData: Record<string, T>): void {
    this.store.clear();

    Object.entries(newData).forEach(([key, value]) =>
      this.store.set(key, value),
    );
  }

  forEach(fn: (value: T, key: string) => void) {
    this.store.forEach(fn);
  }
}
