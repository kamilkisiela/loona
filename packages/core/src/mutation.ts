import {
  MutationSchema,
  MutationDef,
  MutationResolveFn,
  UpdateContext,
} from './types';
import { Store } from './store';
import { getNameOfMutation } from './helpers';
import { runUpdates, UpdateManager } from './update';

export class MutationManager extends Store<MutationDef> {
  constructor(defs?: MutationDef[]) {
    super();

    if (defs) {
      defs.forEach(def => {
        this.set(getNameOfMutation(def.mutation), def);
      });
    }
  }
}

export function createMutationSchema(
  mutationManager: MutationManager,
  updates: UpdateManager,
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
  updates: UpdateManager,
): MutationResolveFn {
  return async (_, args, ctx) => {
    const result = await def.resolve(_, args, ctx);
    const context: UpdateContext = {
      name,
      result,
    };

    await runUpdates({
      updates,
      context,
      cache: ctx.cache,
    });

    return result;
  };
}
