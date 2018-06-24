import gql from 'graphql-tag';

export const currentGameFragment = gql`
  fragment currentGameFragment on CurrentGame {
    teamAName
    teamBName
    teamAScore
    teamBScore
  }
`;
