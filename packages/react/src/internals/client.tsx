import {ApolloClient} from 'apollo-client';

export class Loona {
  constructor(client: ApolloClient<any>, states: any[]) {
    console.log('[Loona::client]', client);
    console.log('[Loona::states]', states);
  }

  dispatch(action: any): void {
    console.log('[Loona::dispatch] Dispatched', action);
    console.error('[Loona::dispatch] Not yet implemented');
  }
}
