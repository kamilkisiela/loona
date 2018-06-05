import { DataProxy } from 'apollo-cache';

import {
  UpdateDef,
  UpdateDefFull,
  UpdateDefShort,
  UpdateContext,
} from './types';

export function runUpdates({
  updates,
  context,
  cache,
}: {
  updates?: UpdateDef[];
  context: UpdateContext;
  cache: DataProxy;
}): void {
  if (!updates) {
    return;
  }

  updates.forEach(update => {
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
