import { createGameMutation } from './graphql/create-game.mutation';

export class UpdateName {
  static type = 'updateName';

  constructor(public team: 'A' | 'B', public name: string) {}
}

export class Goal {
  static type = 'goal';

  constructor(public team: 'A' | 'B') {}
}

export class ResetCurrentGame {
  static type = 'resetCurrentGame';
}

export class UpdateGameStatus {
  static type = 'updateGameStatus';

  constructor(public created: boolean, public error: boolean) {}
}

export class GameCreationSuccess {
  static type = 'GameCreationSuccess';
}

export class GameCreationFailure {
  static type = 'GameCreationFailure';
}

export class CreateGame {
  static type = 'createGame';
  mutation = createGameMutation;
  constructor(public variables: any) {}
}
