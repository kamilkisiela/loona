import gql from 'graphql-tag';

import {gameFragment} from './game.fragment';

export const createGameMutation = gql`
  mutation CreateGame(
    $teamAScore: Int!
    $teamBScore: Int!
    $teamAName: String!
    $teamBName: String!
  ) {
    createGame(
      teamAScore: $teamAScore
      teamBScore: $teamBScore
      teamAName: $teamAName
      teamBName: $teamBName
    ) {
      ...gameFragment
    }
  }

  ${gameFragment}
`;
