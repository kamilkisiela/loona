import { currentGame } from './index';
import { update } from './update';

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
    updateName: update(currentGame, (prev, { team, name }) => ({
      currentGame: {
        ...prev.currentGame,
        [`team${team}Name`]: name,
      },
    })),
    goal: update(currentGame, (prev, { team }) => ({
      currentGame: {
        ...prev.currentGame,
        [`team${team}Score`]: prev.currentGame[`team${team}Score`] + 1,
      },
    })),
    resetCurrentGame: (_, _args, { cache }) => {
      cache.writeData({ data: defaultState });

      return defaultState.currentGame;
    },
  },
};
