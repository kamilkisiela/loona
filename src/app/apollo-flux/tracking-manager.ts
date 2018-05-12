import { Injectable, Provider } from '@angular/core';

import { Mutation } from './models';

class Storage {
  private key = '[apollo flux] Pending Mutations';
  private pending: {
    ids: string[];
    data: Record<string, Mutation>;
  } = {
    ids: [],
    data: {},
  };

  add(id: string, mutation: Mutation) {
    this.pending.ids.push(id);
    this.pending.data[id] = mutation;

    this.persist();
  }

  get(id: string) {
    return this.pending.data[id];
  }

  has(id: string) {
    return this.pending.ids.some(val => val === id);
  }

  delete(id: string) {
    this.pending.ids = this.pending.ids.filter(val => val !== id);
    delete this.pending.data[id];

    this.persist();
  }

  persist() {
    localStorage.setItem(this.key, JSON.stringify(this.pending));
  }

  restore(): Mutation[] {
    const restored = JSON.parse(localStorage.getItem(this.key));

    if (!restored) {
      return;
    }

    this.pending = restored;
    this.persist();

    return this.pending.ids.map(id => {
      const mutation = this.pending.data[id];

      // TODO: this should not be a part of Storage
      mutation.extra.__pending__ = id;

      return mutation;
    });
  }
}

@Injectable()
export class TrackingManager {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  restore() {
    return this.storage.restore();
  }

  start(mutationId: string, mutation: Mutation) {
    if (this.isPending(mutationId)) {
      return;
    }

    this.storage.add(mutationId, mutation);
  }

  stop(mutationId: string) {
    this.storage.delete(mutationId);
  }

  getId(mutation: Mutation): string {
    return mutation.extra && mutation.extra.__pending__;
  }

  private isPending(mutationId: string): boolean {
    return this.storage.has(mutationId);
  }
}

export const TRACKING_MANAGER_PROVIDERS: Provider[] = [TrackingManager];
