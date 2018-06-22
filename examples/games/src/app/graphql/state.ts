import { currentGame } from './index';

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
    updateName: (_, { team, name }, { cache }) => {
      const query = currentGame;
      const previous = cache.readQuery({ query });
      const data = {
        currentGame: {
          ...previous.currentGame,
          [`team${team}Name`]: name,
        },
      };

      cache.writeQuery({ query, data });

      return data.currentGame;
    },
    goal: (_, { team }, { cache }) => {
      const query = currentGame;
      const previous = cache.readQuery({ query });
      const data = {
        currentGame: {
          ...previous.currentGame,
          [`team${team}Score`]: previous.currentGame[`team${team}Score`] + 1,
        },
      };

      cache.writeQuery({ query, data });

      return data.currentGame;
    },
    resetCurrentGame: (_, _args, { cache }) => {
      cache.writeData({ data: defaultState });

      return defaultState.currentGame;
    },
  },
};
