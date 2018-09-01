import {Store} from './internal/store';
import {ResolverDef} from './types/resolver';
import {QueryDef} from './types/query';

export class ResolversManager extends Store<ResolverDef> {
  constructor(defs?: ResolverDef[], queries?: QueryDef[]) {
    super();

    if (defs) {
      defs.forEach(def => {
        this.set(def.path, def);
      });
    }

    if (queries) {
      queries.forEach(def => {
        const path = `Query.${def.name}`;
        
        this.set(path, {
          path,
          resolve: def.resolve,
        });
      });
    }
  }
}
