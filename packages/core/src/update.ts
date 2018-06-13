import { DataProxy } from 'apollo-cache';

import {
  UpdateDef,
  UpdateDefFull,
  UpdateDefShort,
  UpdateContext,
} from './types';

export class UpdateManager {
  constructor(private defs: UpdateDef[] = []) {}

  add(def: UpdateDef): void {
    this.defs.push(def);
  }

  get(): UpdateDef[] {
    return this.defs;
  }
}

export function runUpdates({
  updates,
  context,
  cache,
}: {
  updates: UpdateManager;
  context: UpdateContext;
  cache: DataProxy;
}): void {
  if (!updates) {
    return;
  }

  updates.get().forEach(update => {
    if (update.match(context)) {
      if (isFull(update)) {
        update.resolve({
          ...context,
          cache,
        });
      } else if (isShort(update)) {
        const data = cache.readQuery({
          query: update.query,
        });
        const newData = update.update(data, context.result);

        cache.writeQuery({
          query: update.query,
          data: newData,
        });
      }
    }
  });
}

export function isFull(update: UpdateDef): update is UpdateDefFull {
  return typeof (update as UpdateDefFull).resolve !== 'undefined';
}

export function isShort(update: UpdateDef): update is UpdateDefShort {
  return typeof (update as UpdateDefShort).update !== 'undefined';
}
