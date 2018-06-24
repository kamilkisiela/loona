import gql from 'graphql-tag';

export const resetCurrentGameMutation = gql`
  mutation {
    resetCurrentGame @client
  }
`;
