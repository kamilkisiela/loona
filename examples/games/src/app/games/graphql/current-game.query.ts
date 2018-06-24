import gql from 'graphql-tag';

import { currentGameFragment } from './current-game.fragment';

export const currentGameQuery = gql`
  query {
    currentGame @client {
      ...currentGameFragment
    }
  }

  ${currentGameFragment}
`;
