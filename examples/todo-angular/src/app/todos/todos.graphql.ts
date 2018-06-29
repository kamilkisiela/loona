import gql from 'graphql-tag';

export const todoFragment = gql`
  fragment todoFragment on Todo {
    id
    text
    completed
  }
`;

export const completedTodos = gql`
  query completed {
    completed @client {
      ...todoFragment
    }
  }
  ${todoFragment}
`;

export const activeTodos = gql`
  query active {
    active @client {
      ...todoFragment
    }
  }
  ${todoFragment}
`;

export const addTodo = gql`
  mutation add($text: String!) {
    addTodo(text: $text) @client {
      ...todoFragment
    }
  }

  ${todoFragment}
`;

export const toggleTodo = gql`
  mutation toggle($id: ID!) {
    toggleTodo(id: $id) @client {
      ...todoFragment
    }
  }

  ${todoFragment}
`;
