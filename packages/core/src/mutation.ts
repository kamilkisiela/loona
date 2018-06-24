import { MutationDef } from './types/mutation';
import { Store } from './internal/store';
import { getNameOfMutation } from './helpers';

export class MutationManager extends Store<MutationDef> {
  constructor(defs?: MutationDef[]) {
    super();

    if (defs) {
      defs.forEach(def => {
        this.set(getNameOfMutation(def.mutation), def);
      });
    }
  }
}
