import gql from 'graphql-tag';

export const countQuery = gql`
  query CountGames {
    count @client
  }
`;
