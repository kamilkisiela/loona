import gql from 'graphql-tag';

export const typeDefs = `
  type Todo {
    id: Int!
    text: String!
    completed: Boolean!
  }
  type Mutation {
    addTodo(text: String!): Todo
    toggleTodo(id: Int!): Todo
  }
  type Query {
    todos: [Todo]
    recentTodo: Todo
  }
`;

export const defaults = {
  todos: [],
  recentTodo: null,
};

let nextTodoId = 0;

export const resolvers = {
  Query: {
    recentTodo: (_, { text }, { cache }) => {
      const query = gql`
        query GetTodos {
          todos @client {
            id
            text
            completed
          }
        }
      `;

      const data: any = cache.readQuery({ query });

      if (data.todos && data.todos.length > 0) {
        return data.todos[data.todos.length - 1];
      }

      return null;
    },
  },
  Mutation: {
    addTodo: (_, { text }, { cache }) => {
      const fragment = gql`
        fragment newTodo on TodoItem {
          completed
        }
      `;

      const newTodo = {
        id: nextTodoId++,
        text,
        completed: false,
        __typename: 'TodoItem',
      };

      cache.writeFragment({
        fragment,
        id: `TodoItem:${newTodo.id}`,
        data: newTodo,
      });

      return newTodo;
    },
    toggleTodo: (_, variables, { cache }) => {
      const id = `TodoItem:${variables.id}`;
      const fragment = gql`
        fragment completeTodo on TodoItem {
          completed
        }
      `;
      const todo = cache.readFragment({ fragment, id });
      const data = { ...todo, completed: !todo.completed };

      cache.writeData({ id, data });

      return null;
    },
  },
};
