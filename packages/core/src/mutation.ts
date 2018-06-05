import {
  MutationSchema,
  MutationDef,
  MutationResolveFn,
  UpdateDef,
  UpdateContext,
} from './types';

import { getNameOfMutation } from './utils';

import { runUpdates } from './update';

export function createMutationSchema(
  defs: MutationDef[],
  updates: UpdateDef[],
): MutationSchema {
  const schema: MutationSchema = {};

  if (defs) {
    defs.forEach(def => {
      const name = getNameOfMutation(def.mutation);
      schema[name] = createMutationResolver(name, def, updates);
    });
  }

  return schema;
}

function createMutationResolver(
  name: string,
  def: MutationDef,
  updateDefs: UpdateDef[],
): MutationResolveFn {
  return (_, args, ctx) => {
    const result = def.resolve(_, args, ctx);
    const updateCtx: UpdateContext = {
      name,
      result,
    };

    runUpdates(updateDefs, updateCtx, ctx.cache);

    return result;
  };
}
