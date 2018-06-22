export const METADATA_KEY = '@@apollo-flux';

export interface Metadata {
  queries: Array<{ propName: string }>;
  mutations: Array<{ propName: string; options: any }>;
  updates: Array<{ propName: string; options?: any }>;
  defaults: any;
  typeDefs?: string | string[];
}

export function ensureMetadata(target: any): Metadata {
  if (!target.hasOwnProperty(METADATA_KEY)) {
    const defaultValue: Metadata = {
      defaults: [],
      mutations: [],
      queries: [],
      updates: [],
      typeDefs: [],
    };

    Object.defineProperty(target, METADATA_KEY, {
      value: defaultValue,
    });
  }

  return target[METADATA_KEY];
}

export function getProtoOfInstance(instance: Object): any {
  return Object.getPrototypeOf(instance);
}

export function getMetadata(proto: any): Metadata {
  return proto.constructor[METADATA_KEY] || [];
}
