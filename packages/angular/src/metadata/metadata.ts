import { Metadata } from '../types/metadata';

export const METADATA_KEY = '@@loona';

export function ensureMetadata(target: any): Metadata {
  if (!target.hasOwnProperty(METADATA_KEY)) {
    const defaultValue: Metadata = {
      defaults: {},
      mutations: [],
      actions: {},
      queries: [],
      typeDefs: [],
    };

    Object.defineProperty(target, METADATA_KEY, {
      value: defaultValue,
    });
  }

  return target[METADATA_KEY];
}
