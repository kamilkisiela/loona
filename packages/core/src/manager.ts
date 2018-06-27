import {ApolloCache} from 'apollo-cache';
import {MutationManager} from './mutation';
import {QueryManager} from './query';
import {Options} from './types/options';

export class Manager {
  cache: ApolloCache<any>;
  queries: QueryManager;
  mutations: MutationManager;
  resolvers: any;
  defaults: any;
  typeDefs: string | string[] | undefined;

  constructor(options: Options) {
    this.cache = options.cache;
    this.defaults = options.defaults;
    this.resolvers = options.resolvers;
    this.typeDefs = options.typeDefs;
    this.queries = new QueryManager(options.queries);
    this.mutations = new MutationManager(options.mutations);
  }
}
