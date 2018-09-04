import React, { Component } from 'react';
import { LoonaProvider, createLoona, Action } from '@loona/react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

const cache = new InMemoryCache();

const loona = createLoona(cache, []);
const client = new ApolloClient({
  link: loona,
  cache: new InMemoryCache()
});

export class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LoonaProvider loona={loona}>
          <div>works</div>
          <Action>
            {dispatch => <button onClick={() => dispatch('custom')}>Dispatch custom</button>}
          </Action>
          <Action action="defined">
            {dispatch => <button onClick={() => dispatch()}>Dispatch predefined</button>}
          </Action>
        </LoonaProvider>
      </ApolloProvider>
    );
  }
}
