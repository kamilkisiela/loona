import React from 'react';
import {LoonaProvider} from '@loona/react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';
import {ApolloLink} from 'apollo-link';

import {Root} from './Root';
import {states} from './states';

const client = new ApolloClient({
  link: new ApolloLink(),
  cache: new InMemoryCache(),
});

export class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LoonaProvider states={states}>
          <Root />
        </LoonaProvider>
      </ApolloProvider>
    );
  }
}
