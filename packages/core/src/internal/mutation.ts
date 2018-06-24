import {
  MutationSchema,
  MutationDef,
  MutationResolveFn,
} from '../types/mutation';
import { MutationManager } from '../mutation';

export function createMutationSchema(
  mutationManager: MutationManager,
): MutationSchema {
  const schema: MutationSchema = {};

  mutationManager.forEach((def, name) => {
    schema[name] = createMutationResolver(def);
  });

  return schema;
}

function createMutationResolver(def: MutationDef): MutationResolveFn {
  return async (_, args, ctx) => {
    const result = await def.resolve(_, args, ctx);
    return result;
  };
}
