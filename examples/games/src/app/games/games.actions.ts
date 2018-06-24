import { goalMutation } from './graphql/goal.mutation';
import { updateNameMutation } from './graphql/update-name.mutation';
import { updateGameStatusMutation } from './graphql/update-game-status.mutation';
import { resetCurrentGameMutation } from './graphql/reset-current-game.mutation';
import { createGameMutation } from './graphql/create-game.mutation';

export class UpdateName {
  static mutation = updateNameMutation;
  constructor(public variables: { team: 'A' | 'B'; name: string }) {}
}

export class Goal {
  static mutation = goalMutation;
  variables: any;
  constructor(team: 'A' | 'B') {
    this.variables = { team };
  }
}

export class ResetCurrentGame {
  static mutation = resetCurrentGameMutation;
}

export class UpdateGameStatus {
  static mutation = updateGameStatusMutation;

  constructor(public variables: { created: boolean; error: boolean }) {}
}

export class GameCreationSuccess {
  static type = '[Game] Finished! :)';
}

export class GameCreationFailure {
  static type = '[Game] Failure :(';
}

export class CreateGame {
  static mutation = createGameMutation;
  constructor(public variables: any) {}
}
