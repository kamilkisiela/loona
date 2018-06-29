import {ApolloCache} from 'apollo-cache';
import {MutationManager} from './mutation';
import {QueryManager} from './query';
import {UpdateManager} from './update';
import {Options} from './types/options';

export class Manager {
  cache: ApolloCache<any>;
  queries: QueryManager;
  mutations: MutationManager;
  updates: UpdateManager;
  resolvers: any;
  defaults: any;
  typeDefs: string | string[] | undefined;

  constructor(options: Options) {
    this.cache = options.cache;
    this.defaults = options.defaults;
    this.resolvers = options.resolvers;
    this.typeDefs = options.typeDefs;
    this.updates = new UpdateManager(options.updates);
    this.queries = new QueryManager(options.queries);
    this.mutations = new MutationManager(options.mutations);
  }
}
