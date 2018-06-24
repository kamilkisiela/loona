import { Store } from './internal/store';
import { QueryDef } from './types/query';

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
