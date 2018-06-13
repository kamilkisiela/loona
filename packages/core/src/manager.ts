import { MutationManager } from './mutation';
import { QueryManager } from './query';
import { UpdateManager } from './update';
import { QueryDef, MutationDef, UpdateDef } from './types';

export class Manager {
  queries: QueryManager;
  mutations: MutationManager;
  updates: UpdateManager;

  constructor(options: {
    queries?: QueryDef[];
    mutations?: MutationDef[];
    updates?: UpdateDef[];
  }) {
    this.queries = new QueryManager(options.queries);
    this.mutations = new MutationManager(options.mutations);
    this.updates = new UpdateManager(options.updates);
  }
}
