import React from 'react';
import {LoonaProvider, createLoona} from '@loona/react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';

import {Books} from './Books';
import {BooksState} from './books.state';

const cache = new InMemoryCache();

const loona = createLoona(cache);
const client = new ApolloClient({
  link: loona,
  cache,
});

export class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LoonaProvider loona={loona} states={[BooksState]}>
          <Books />
        </LoonaProvider>
      </ApolloProvider>
    );
  }
}
