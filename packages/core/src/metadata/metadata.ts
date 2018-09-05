import {Metadata} from '../types/metadata';

export const METADATA_KEY = '@@loona';

export function readMetadata<T = Metadata>(target: any): T {
  const constructor = target.constructor;

  return constructor[METADATA_KEY];
}

export function ensureMetadata<T = Metadata>(target: any): T {
  if (!target.hasOwnProperty(METADATA_KEY)) {
    const defaultValue: Metadata = {
      defaults: {},
      mutations: [],
      resolvers: [],
      updates: [],
      typeDefs: [],
    };

    Object.defineProperty(target, METADATA_KEY, {
      value: defaultValue,
    });
  }

  return target[METADATA_KEY];
}
