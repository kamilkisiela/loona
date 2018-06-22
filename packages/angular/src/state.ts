import { ensureMetadata, Metadata, METADATA_KEY } from './metadata';

export interface StateClass {
  [METADATA_KEY]: Metadata;
}

export interface StateOptions<T> {
  defaults?: T;
  typeDefs?: string | string[];
}

export function State<T>(options: StateOptions<T>) {
  return (target: any) => {
    const meta = ensureMetadata(target);

    meta.defaults = options.defaults;
    meta.typeDefs = options.typeDefs;
  };
}

export function extractDefaults(states: any[] = []): any {
  return Object.assign({}, ...states);
}
