import {QuerySchema, QueryDef, QueryResolveFn} from '../types/query';
import {Manager} from '../manager';

export function createQuerySchema(manager: Manager): QuerySchema {
  const schema: QuerySchema = {};

  manager.queries.forEach((def, name) => {
    schema[name] = createQueryResolver(def);
  });

  return schema;
}

function createQueryResolver(def: QueryDef): QueryResolveFn {
  return def.resolve;
}
