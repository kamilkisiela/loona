import React, {Component} from 'react';
import {LoonaProvider, createLoona, Action} from '@loona/react';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';

import {Books, addBook} from './Books';

const cache = new InMemoryCache();

const loona = createLoona(cache, [
  {
    mutations: [
      {
        mutation: addBook,
        resolve: (args, context) => {
          const book = {
            id: parseInt(
              Math.random()
                .toString()
                .substr(2),
            ),
            title: args.title,
            __typename: 'Book',
          };

          return new Promise(resolve => {
            setTimeout(() => {
              resolve(book);
            }, 2000);
          });
        },
      },
    ],
  },
]);
const client = new ApolloClient({
  link: loona,
  cache: new InMemoryCache(),
});

export class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <LoonaProvider loona={loona}>
          <Action>
            {dispatch => (
              <button onClick={() => dispatch('custom')}>
                Dispatch custom
              </button>
            )}
          </Action>
          <Action action="add">
            {add => (
              <button
                onClick={() =>
                  add({
                    test: 'test',
                  })
                }
              >
                Dispatch predefined
              </button>
            )}
          </Action>
          <br />
          <Books />
        </LoonaProvider>
      </ApolloProvider>
    );
  }
}
