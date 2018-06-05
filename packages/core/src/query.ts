import { QueryMap, QuerySchema, QueryDef, QueryResolveFn } from './types';

export class QueryManager {
  private queries: QueryMap = {};

  constructor(defs?: QueryDef[]) {
    if (defs) {
      defs.forEach(def => {
        this.add(def.name, def);
      });
    }
  }

  add(name: string, def: QueryDef): void {
    this.queries = {
      ...this.queries,
      [name]: def,
    };
  }

  get(name: string): QueryDef {
    return this.queries[name];
  }

  forEach(cb: (def: QueryDef, name: string) => void): void {
    for (const name in this.queries) {
      if (this.queries.hasOwnProperty(name)) {
        const def = this.queries[name];
        cb(def, name);
      }
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
