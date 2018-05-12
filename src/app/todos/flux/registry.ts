import gql from 'graphql-tag';

export const addTodoMutation = gql`
  mutation addTodo($text: String!) {
    addTodo(text: $text) @client {
      id
      completed
      text
    }
  }
`;

export const toggleTodoMutation = gql`
  mutation toggleTodo($id: Int!) {
    toggleTodo(id: $id) @client {
      id
    }
  }
`;

export const AddTodoMutation = {
  name: 'addTodo',
  options: {
    mutation: addTodoMutation,
    context: {
      serializationKey: 'addTodo',
    },
  },
};

export const ToggleTodoMutation = {
  name: 'toggleTodo',
  options: {
    mutation: toggleTodoMutation,
  },
};
