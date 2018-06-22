import { Store } from './store';
import { QuerySchema, QueryDef, QueryResolveFn } from './types';

export class QueryManager extends Store<QueryDef> {
  constructor(defs?: QueryDef[]) {
    super();

    if (defs) {
      defs.forEach(def => {
        this.set(def.name, def);
      });
    }
  }
}

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
