import {ApolloCache} from 'apollo-cache';

import {MutationManager} from './mutation';
import {UpdateManager} from './update';
import {ResolversManager} from './resolvers';
import {Options} from './types/options';
import {Metadata} from './types/metadata';
import {transformMutations} from './metadata/mutation';
import {transformUpdates} from './metadata/update';
import {transformResolvers} from './metadata/resolve';

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
    this.resolvers = new ResolversManager(options.resolvers);
    this.updates = new UpdateManager(options.updates);
    this.mutations = new MutationManager(options.mutations);
  }

  addState(
    instance: any,
    meta: Metadata,
    transformFn?: ((resolver: any) => any),
  ) {
    this.mutations.add(transformMutations(instance, meta, transformFn));
    this.updates.add(transformUpdates(instance, meta, transformFn) || []);
    this.resolvers.add(transformResolvers(instance, meta, transformFn) || []);

    if (meta.defaults) {
      this.cache.writeData({
        data: meta.defaults,
      });
    }

    if (meta.typeDefs) {
      if (!this.typeDefs) {
        this.typeDefs = [];
      }

      if (typeof this.typeDefs === 'string') {
        this.typeDefs = [this.typeDefs];
      }

      this.typeDefs.push(
        ...(typeof meta.typeDefs === 'string'
          ? [meta.typeDefs]
          : meta.typeDefs),
      );
    }
  }
}
