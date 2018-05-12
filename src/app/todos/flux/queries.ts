import gql from 'graphql-tag';

export const recentTodoQuery = gql`
  {
    recentTodo @client {
      id
      completed
      text
    }
  }
`;

export const todosQuery = gql`
  {
    todos @client {
      id
      completed
      text
    }
  }
`;
