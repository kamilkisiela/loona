import gql from 'graphql-tag';

import { gameFragment } from './game.fragment';

export const allGamesQuery = gql`
  query AllGames {
    allGames {
      ...gameFragment
    }
  }

  ${gameFragment}
`;
