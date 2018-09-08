import gql from 'graphql-tag';

export const updateNameMutation = gql`
  mutation updateName($team: String!, $name: String!) {
    updateName(team: $team, name: $name) @client
  }
`;
