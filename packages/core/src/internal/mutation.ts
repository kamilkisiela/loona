import {MutationSchema, MutationDef} from '../types/mutation';
import {ResolveFn} from '../types/common';
import {MutationInfo} from '../types/update';
import {runUpdates} from './update';
import {UpdateManager} from '../update';
import {Manager} from '../manager';
import {getNameOfMutation} from '../helpers';
import {buildContext} from './context';

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
): ResolveFn {
  return async (_, args, context) => {
    const enhancedContext = buildContext(context);
    const result = await def.resolve(args, enhancedContext);

    const info: MutationInfo = {
      name: getNameOfMutation(def.mutation),
      variables: args,
      result,
    };

    runUpdates({
      updates,
      info,
      context: enhancedContext,
    });

    return result;
  };
}
