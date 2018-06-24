import gql from 'graphql-tag';

export const goalMutation = gql`
  mutation goal($team: String!) {
    goal(team: $team) @client
  }
`;
