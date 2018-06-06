import {
  MutationSchema,
  MutationDef,
  MutationResolveFn,
  UpdateDef,
  UpdateContext,
} from './types';
import { Store } from './store';
import { getNameOfMutation } from './utils';
import { runUpdates } from './update';

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
    const context: UpdateContext = {
      name,
      result,
    };

    runUpdates({
      updates,
      context,
      cache: ctx.cache,
    });

    return result;
  };
}
