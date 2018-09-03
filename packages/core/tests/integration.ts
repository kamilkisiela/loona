import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {LoonaLink} from '../src';

describe('integration', () => {
  const cache = new InMemoryCache();

  const query = gql`
    {
      todos @client {
        id
        completed
        text
      }
    }
  `;

  const mutation = gql`
    mutation addTodo($text: String!) {
      ADD_TODO(text: $text) @client {
        id
        completed
        text
      }
    }
  `;

  const ADD_TODO = {
    mutation,
    resolve: ({text}, {cache}) => {
      const todo = {
        id: 'TEMP_ID',
        text,
        completed: false,
        __typename: 'Todo',
      };

      cache.writeFragment({
        fragment: gql`
          fragment newTodo on Todo {
            id
            text
            completed
          }
        `,
        id: `Todo:${todo.id}`,
        data: todo,
      });

      return todo;
    },
  };

  // const updateTodos = {
  //   match: ofName('ADD_TODO'),
  //   resolve: ({ result, cache }) => {
  //     const previous: any = cache.readQuery({ query });
  //     const data = { todos: previous.todos.concat([result]) };

  //     cache.writeData({ data });
  //   },
  // };

  // const updateTodosSimple = {
  //   match: ofName('ADD_TODO'),
  //   query,
  //   update: (data, todo) => ({ todos: data.todos.concat([todo]) }),
  // };

  const defaults = {
    todos: [],
  };

  const link = new LoonaLink({
    cache,
    typeDefs: `
      type Todo {
          id: String!
          text: String!
          completed: Boolean!
      }
      
      type Mutation {
          ADD_TODO (text: String!): Todo
      }
      
      type Query {
          todos: [Todo]
      }
    `,
    defaults,
    mutations: [ADD_TODO],
  });

  const apollo = new ApolloClient({
    cache,
    link,
  });

  const client = {
    query: opts => apollo.watchQuery(opts),
    mutate: (name, variables) => {
      const {mutation} = link.manager.mutations.get(name);

      apollo.mutate({
        mutation,
        variables,
      });
    },
  };

  test('should be able to query data', () => {
    client
      .query({
        query,
      })
      .subscribe(() => {
        //
      });
  });

  test('should be able to call a mutation', () => {
    client.mutate('ADD_TODO', {text: 'Random Text'});
  });

  test.skip('should be able to dispatch an action', () => {
    // client.dispatch('NEW_TODO', {
    //   todo: {
    //     text: 'Random Text',
    //   },
    // });
  });
});
