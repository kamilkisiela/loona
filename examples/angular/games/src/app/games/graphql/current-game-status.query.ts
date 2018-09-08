import gql from 'graphql-tag';

export const currentGameStatusQuery = gql`
  query {
    currentGameStatus @client {
      error
      created
    }
  }
`;
