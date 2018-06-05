import { QueryMap, QuerySchema, QueryDef, QueryResolveFn } from './types';

export function createQuerySchema(defs: QueryMap): QuerySchema {
  const schema: QuerySchema = {};

  if (defs) {
    Object.keys(defs).forEach(name => {
      schema[name] = createQueryResolver(defs[name]);
    });
  }

  return schema;
}

function createQueryResolver(def: QueryDef): QueryResolveFn {
  return def;
}
