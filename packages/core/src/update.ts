import {UpdateDef} from './types/update';

export class UpdateManager {
  constructor(private defs: UpdateDef[] = []) {}

  add(def: UpdateDef | UpdateDef[]): void {
    if (Array.isArray(def)) {
      this.defs.push(...def);
    } else {
      this.defs.push(def);
    }
  }

  get(): UpdateDef[] {
    return this.defs;
  }
}
