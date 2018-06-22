import { State, Mutation } from '@apollo-flux/angular';
import gql from 'graphql-tag';

import { currentGameQuery, currentGameStatusQuery } from './index';
import { Update } from './update';
import { Write } from './write';

const defaultState = {
  currentGameStatus: {
    __typename: 'GameStatus',
    created: false,
    error: false,
  },
  currentGame: {
    __typename: 'CurrentGame',
    teamAScore: 0,
    teamBScore: 0,
    teamAName: 'Team A',
    teamBName: 'Team B',
  },
};

@State({
  defaults: defaultState,
})
export class Games {
  @Mutation({
    mutation: gql`
      mutation updateName($team: String!, $name: String!) {
        updateName(team: $team, name: $name) @client
      }
    `,
  })
  @Update(currentGameQuery)
  updateName(state, { team, name }, context) {
    state.currentGame[`team${team}Name`] = name;
  }

  @Mutation({
    mutation: gql`
      mutation goal($team: String!) {
        goal(team: $team) @client
      }
    `,
  })
  @Update(currentGameQuery)
  goal(state, { team }) {
    state.currentGame[`team${team}Score`] += 1;
  }

  @Mutation({
    mutation: gql`
      mutation updateGameStatus($error: Boolean, $created: Boolean) {
        updateGameStatus(error: $error, created: $created) @client
      }
    `,
  })
  @Update(currentGameStatusQuery)
  updateGameStatus(state, { created, error }) {
    if (created) {
      state.currentGameStatus.created = true;
    } else if (error) {
      state.currentGameStatus.error = true;
    }
  }

  @Mutation({
    mutation: gql`
      mutation resetCurrentGame {
        resetCurrentGame @client
      }
    `,
  })
  @Write()
  resetCurrentGame() {
    return defaultState;
  }
}
