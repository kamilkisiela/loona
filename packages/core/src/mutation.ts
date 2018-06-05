import {
  MutationSchema,
  MutationDef,
  MutationResolveFn,
  MutationMap,
  UpdateDef,
  UpdateContext,
} from './types';

import { getNameOfMutation } from './utils';

import { runUpdates } from './update';

export class MutationManager {
  private mutations: MutationMap = {};

  constructor(defs?: MutationDef[]) {
    if (defs) {
      defs.forEach(def => {
        this.add(getNameOfMutation(def.mutation), def);
      });
    }
  }

  add(name: string, def: MutationDef): void {
    this.mutations = {
      ...this.mutations,
      [name]: def,
    };
  }

  get(name: string): MutationDef {
    return this.mutations[name];
  }

  forEach(cb: (def: MutationDef, name: string) => void): void {
    for (const name in this.mutations) {
      if (this.mutations.hasOwnProperty(name)) {
        const def = this.mutations[name];
        cb(def, name);
      }
    }
  }
}

export function createMutationSchema(
  mutationManager: MutationManager,
  updates?: UpdateDef[],
): MutationSchema {
  const schema: MutationSchema = {};

  mutationManager.forEach((def, name) => {
    schema[name] = createMutationResolver(name, def, updates);
  });

  return schema;
}

function createMutationResolver(
  name: string,
  def: MutationDef,
  updates?: UpdateDef[],
): MutationResolveFn {
  return (_, args, ctx) => {
    const result = def.resolve(_, args, ctx);
    const updateCtx: UpdateContext = {
      name,
      result,
    };

    runUpdates({
      updates,
      context: updateCtx,
      cache: ctx.cache,
    });

    return result;
  };
}
