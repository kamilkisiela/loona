import {Store} from './internal/store';
import {UpdateDef} from './types/update';

export class UpdateManager extends Store<UpdateDef[]> {
  constructor(defs?: UpdateDef[]) {
    super();

    if (defs) {
      this.add(defs);
    }
  }

  add(defs: UpdateDef[] | UpdateDef): void {
    if (!Array.isArray(defs)) {
      defs = [defs];
    }

    defs.forEach(def => {
      const all = this.get(def.mutation) || [];

      all.push(def);

      super.set(def.mutation, all);
    });
  }

  set() {
    console.error('Use add() instead');
  }
}
