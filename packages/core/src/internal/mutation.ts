import {MutationSchema, MutationDef} from '../types/mutation';
import {ResolveFn} from '../types/common';
import {Manager} from '../manager';
import {buildContext} from '../helpers';

export function createMutationSchema(manager: Manager): MutationSchema {
  const schema: MutationSchema = {};

  manager.mutations.forEach((def, name) => {
    schema[name] = createMutationResolver(def, manager);
  });

  return schema;
}

function createMutationResolver(def: MutationDef, manager: Manager): ResolveFn {
  return async (_, args, context) => {
    return def.resolve(args, buildContext(context, manager.getClient()));
  };
}
