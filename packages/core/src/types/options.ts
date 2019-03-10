import {ApolloClient} from 'apollo-client';
import {UpdateDef} from './update';

export interface Options {
  getClient?: () => ApolloClient<any>;
  updates?: UpdateDef[];
}
