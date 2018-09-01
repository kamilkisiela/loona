import {ApolloCache} from 'apollo-cache';
import {MutationManager} from './mutation';
import {UpdateManager} from './update';
import {ResolversManager} from './resolvers';
import {Options} from './types/options';

export class Manager {
  cache: ApolloCache<any>;
  mutations: MutationManager;
  updates: UpdateManager;
  resolvers: ResolversManager;
  defaults: any;
  typeDefs: string | string[] | undefined;

  constructor(options: Options) {
    this.cache = options.cache;
    this.defaults = options.defaults;
    this.typeDefs = options.typeDefs;
    this.resolvers = new ResolversManager(options.resolvers, options.queries);
    this.updates = new UpdateManager(options.updates);
    this.mutations = new MutationManager(options.mutations);
  }
}
