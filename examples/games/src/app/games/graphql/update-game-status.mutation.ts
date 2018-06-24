import gql from 'graphql-tag';

export const updateGameStatusMutation = gql`
  mutation updateGameStatus($error: Boolean, $created: Boolean) {
    updateGameStatus(error: $error, created: $created) @client
  }
`;
