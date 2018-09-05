import {ApolloClient} from 'apollo-client';
import {Manager} from '@loona/core';

export class Loona {
  constructor(client: ApolloClient<any>, manager: Manager, states: any[]) {
    console.log('[Loona::client]', client);
    console.log('[Loona::manager]', manager);
    console.log('[Loona::states]', states);
  }

  dispatch(action: any): void {
    console.log('[Loona::dispatch] Dispatched', action);
    console.error('[Loona::dispatch] Not yet implemented');
  }
}
