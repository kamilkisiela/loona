import { ensureMetadata } from './metadata';

export interface StateClass {
  //
}

export interface StateOptions<T> {
  defaults?: T;
  typeDefs?: string | string[];
}

export function State<T>(options: StateOptions<T>) {
  return (target: any) => {
    const meta = ensureMetadata(target);

    meta.defaults = options.defaults;
  };
}

export function extractDefaults(states: any[] = []): any {
  return states.reduce(
    (mem, state) => ({
      ...mem,
      ...state,
    }),
    {},
  );
}
