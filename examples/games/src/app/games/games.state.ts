import { State, Mutation, Action, Update } from '@luna/angular';
import { of } from 'rxjs';
import { mapTo, catchError, tap } from 'rxjs/operators';

import { currentGameQuery } from './graphql/current-game.query';
import { currentGameStatusQuery } from './graphql/current-game-status.query';
import { goalMutation } from './graphql/goal.mutation';
import { updateNameMutation } from './graphql/update-name.mutation';
import { resetCurrentGameMutation } from './graphql/reset-current-game.mutation';
import { updateGameStatusMutation } from './graphql/update-game-status.mutation';
import {
  GameCreationSuccess,
  GameCreationFailure,
  ResetCurrentGame,
  UpdateGameStatus,
  CreateGame,
} from './games.actions';

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
export class GamesState {
  @Mutation(updateNameMutation)
  @Update(currentGameQuery)
  updateName(state, { team, name }) {
    state.currentGame[`team${team}Name`] = name;
  }

  @Mutation(goalMutation)
  @Update(currentGameQuery)
  goal(state, { team }) {
    state.currentGame[`team${team}Score`] += 1;
  }

  @Mutation(updateGameStatusMutation)
  @Update(currentGameStatusQuery)
  updateGameStatus(state, { created, error }) {
    if (typeof created !== 'undefined') {
      state.currentGameStatus.created = created;
    }

    if (typeof error !== 'undefined') {
      state.currentGameStatus.error = error;
    }
  }

  @Mutation(resetCurrentGameMutation)
  @Update(currentGameQuery)
  resetCurrentGame() {
    return {
      currentGame: defaultState.currentGame,
    };
  }

  @Action(GameCreationSuccess)
  onSuccess() {
    return of(new UpdateGameStatus(true, false));
  }

  @Action(GameCreationFailure)
  onFailure() {
    return of(new UpdateGameStatus(false, true));
  }

  @Action(ResetCurrentGame)
  onReset() {
    return of(new UpdateGameStatus(false, false));
  }

  @Action(CreateGame)
  onCreateGame(_action, action$) {
    return action$.pipe(
      mapTo(new GameCreationSuccess()),
      catchError(() => of(new GameCreationFailure())),
    );
  }
}
