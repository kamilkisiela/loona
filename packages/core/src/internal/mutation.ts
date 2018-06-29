import {
  MutationSchema,
  MutationDef,
  MutationResolveFn,
} from '../types/mutation';
import {MutationInfo} from '../types/update';
import {runUpdates} from './update';
import {UpdateManager} from '../update';
import {Manager} from '../manager';
import {getNameOfMutation} from '../helpers';

export function createMutationSchema(manager: Manager): MutationSchema {
  const schema: MutationSchema = {};

  manager.mutations.forEach((def, name) => {
    schema[name] = createMutationResolver(def, manager.updates);
  });

  return schema;
}

function createMutationResolver(
  def: MutationDef,
  updates: UpdateManager,
): MutationResolveFn {
  return async (_, args, context) => {
    const result = await def.resolve(_, args, context);

    const info: MutationInfo = {
      name: getNameOfMutation(def.mutation),
      variables: args,
      result,
    };

    runUpdates({
      updates,
      info,
      context,
    });

    return result;
  };
}
