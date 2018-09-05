import {Store} from './internal/store';
import {ResolverDef} from './types/resolver';

export class ResolversManager extends Store<ResolverDef> {
  constructor(defs?: ResolverDef[]) {
    super();

    if (defs) {
      this.add(defs);
    }
  }

  add(defs: ResolverDef[]): void {
    defs.forEach(def => {
      this.set(def.path, def);
    });
  }
}
