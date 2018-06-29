import {UpdateDef} from './types/update';

export class UpdateManager {
  constructor(private defs: UpdateDef[] = []) {}

  add(def: UpdateDef): void {
    this.defs.push(def);
  }

  get(): UpdateDef[] {
    return this.defs;
  }
}
