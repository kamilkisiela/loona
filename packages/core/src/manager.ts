import { MutationManager } from './mutation';
import { QueryManager } from './query';
import { QueryDef, MutationDef } from './types';

export class Manager {
  queries: QueryManager;
  mutations: MutationManager;

  constructor(options: { queries?: QueryDef[]; mutations?: MutationDef[] }) {
    this.queries = new QueryManager(options.queries);
    this.mutations = new MutationManager(options.mutations);
  }
}
