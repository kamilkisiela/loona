import {Resolvers, ResolverDef} from '../types/resolver';
import {Manager} from '../manager';
import {ResolveFn} from '../types/common';
import {buildContext} from '../helpers';

export function createResolvers(manager: Manager): Resolvers {
  const schema: Resolvers = {};

  manager.resolvers.forEach(def => {
    const [typeName, fieldName] = def.path.split('.');

    if (!schema[typeName]) {
      schema[typeName] = {};
    }

    schema[typeName][fieldName] = createResolver(def, manager);
  });

  return schema;
}

function createResolver(def: ResolverDef, manager: Manager): ResolveFn {
  return (parent, args, context) =>
    def.resolve(parent, args, buildContext(context, manager.getClient()));
}
