import gql from 'graphql-tag';

const currentGameFragment = gql`
  fragment currentGameFragment on CurrentGame {
    teamAName
    teamBName
    teamAScore
    teamBScore
  }
`;

const gameFragment = gql`
  fragment gameFragment on Game {
    id
    teamAName
    teamBName
    teamAScore
    teamBScore
  }
`;

export const allGamesQuery = gql`
  query AllGames {
    allGames {
      ...gameFragment
    }
  }

  ${gameFragment}
`;

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

export const currentGameQuery = gql`
  query {
    currentGame @client {
      ...currentGameFragment
    }
  }

  ${currentGameFragment}
`;

export const goalMutation = gql`
  mutation goal($team: String!) {
    goal(team: $team) @client {
      ...currentGameFragment
    }
  }

  ${currentGameFragment}
`;

export const resetCurrentGameMutation = gql`
  mutation {
    resetCurrentGame @client {
      ...currentGameFragment
    }
  }

  ${currentGameFragment}
`;

export const updateNameMutation = gql`
  mutation updateName($team: String!, $name: String!) {
    updateName(team: $team, name: $name) @client {
      ...currentGameFragment
    }
  }

  ${currentGameFragment}
`;
