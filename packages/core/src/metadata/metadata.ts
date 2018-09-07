import {Metadata} from '../types/metadata';

export const METADATA_KEY = '@@loona';

export function readMetadata(target: any): Metadata {
  const constructor = target.constructor;

  return constructor[METADATA_KEY];
}

export function ensureMetadata(target: any): Metadata {
  if (!target.hasOwnProperty(METADATA_KEY)) {
    const defaultValue: Metadata = {
      defaults: {},
      mutations: [],
      resolvers: [],
      updates: [],
      typeDefs: [],
      effects: {},
    };

    Object.defineProperty(target, METADATA_KEY, {
      value: defaultValue,
    });
  }

  return target[METADATA_KEY];
}
