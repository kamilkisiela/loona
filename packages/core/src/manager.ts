import {ApolloClient, Resolvers} from 'apollo-client';
import {UpdateManager} from './update';
import {Options} from './types/options';
import {Metadata} from './types/metadata';
import {transformMutations} from './metadata/mutation';
import {transformUpdates} from './metadata/update';
import {transformResolvers} from './metadata/resolve';
import {buildContext} from './helpers';

export class Manager {
  updates: UpdateManager;
  typeDefs: string | string[] | undefined;
  getClient: () => ApolloClient<any> | never = () => {
    throw new Error('Manager requires ApolloClient');
  };

  constructor(options: Options) {
    this.updates = new UpdateManager(options.updates);

    if (options.getClient) {
      this.getClient = options.getClient;
    }
  }

  addState(
    instance: any,
    meta: Metadata,
    transformFn?: (resolver: any) => any,
  ) {
    const resolvers: Resolvers[] = [];

    transformMutations(instance, meta, transformFn).forEach(def => {
      resolvers.push({
        Mutation: {
          [def.mutation]: (_parent, args, context) =>
            def.resolve(args, buildContext(context, this.getClient())), // we need info here
        },
      });
    });

    (transformResolvers(instance, meta, transformFn) || []).forEach(def => {
      const [typename, fieldname] = def.path.split('.');

      resolvers.push({
        [typename]: {
          [fieldname]: (parent, args, context) =>
            def.resolve(parent, args, buildContext(context, this.getClient())),
        },
      });
    });

    this.updates.add(transformUpdates(instance, meta, transformFn) || []);

    this.getClient().addResolvers(resolvers);

    if (meta.defaults) {
      this.getClient().writeData({
        data: meta.defaults,
      });
    }
  }
}
