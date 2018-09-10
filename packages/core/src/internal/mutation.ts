import {MutationSchema, MutationDef} from '../types/mutation';
import {ResolveFn} from '../types/common';
import {Manager} from '../manager';
import {buildContext} from '../helpers';

export function createMutationSchema(manager: Manager): MutationSchema {
  const schema: MutationSchema = {};

  manager.mutations.forEach((def, name) => {
    schema[name] = createMutationResolver(def);
  });

  return schema;
}

function createMutationResolver(def: MutationDef): ResolveFn {
  return async (_, args, context) => {
    return def.resolve(args, buildContext(context));
  };
}
