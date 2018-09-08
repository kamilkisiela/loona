import gql from 'graphql-tag';

export const gameFragment = gql`
  fragment gameFragment on Game {
    id
    teamAName
    teamBName
    teamAScore
    teamBScore
  }
`;
