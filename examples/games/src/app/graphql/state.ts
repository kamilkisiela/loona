import { currentGameQuery } from './index';
import { update } from './update';
import { write } from './write';

export const defaultState = {
  currentGame: {
    __typename: 'CurrentGame',
    teamAScore: 0,
    teamBScore: 0,
    teamAName: 'Team A',
    teamBName: 'Team B',
  },
};

export const resolvers = {
  Mutation: {
    updateName: update(currentGameQuery, (state, { team, name }) => {
      state.currentGame[`team${team}Name`] = name;
    }),
    goal: update(currentGameQuery, (state, { team }) => {
      state.currentGame[`team${team}Score`] += 1;
    }),
    resetCurrentGame: write(() => defaultState),
  },
};
