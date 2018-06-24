import { QuerySchema, QueryDef, QueryResolveFn } from '../types/query';
import { QueryManager } from '../query';

export function createQuerySchema(queryManager: QueryManager): QuerySchema {
  const schema: QuerySchema = {};

  queryManager.forEach((def, name) => {
    schema[name] = createQueryResolver(def);
  });

  return schema;
}

function createQueryResolver(def: QueryDef): QueryResolveFn {
  return def.resolve;
}
