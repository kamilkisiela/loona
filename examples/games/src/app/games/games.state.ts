import { State, Mutation, Action, Update } from '@luna/angular';
import { of } from 'rxjs';
import { mapTo, catchError } from 'rxjs/operators';

import { currentGameQuery } from './graphql/current-game.query';
import { currentGameStatusQuery } from './graphql/current-game-status.query';
import {
  GameCreationSuccess,
  GameCreationFailure,
  ResetCurrentGame,
  UpdateGameStatus,
  CreateGame,
  UpdateName,
  Goal,
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
  @Mutation(UpdateName)
  @Update(currentGameQuery)
  updateName(state, { team, name }) {
    state.currentGame[`team${team}Name`] = name;
  }

  @Mutation(Goal)
  @Update(currentGameQuery)
  goal(state, { team }) {
    state.currentGame[`team${team}Score`] += 1;
  }

  @Mutation(UpdateGameStatus)
  @Update(currentGameStatusQuery)
  updateGameStatus(state, { created, error }) {
    if (typeof created !== 'undefined') {
      state.currentGameStatus.created = created;
    }

    if (typeof error !== 'undefined') {
      state.currentGameStatus.error = error;
    }
  }

  @Mutation(ResetCurrentGame)
  @Update(currentGameQuery)
  resetCurrentGame() {
    return {
      currentGame: defaultState.currentGame,
    };
  }

  @Action(GameCreationSuccess)
  onSuccess() {
    return of(
      new UpdateGameStatus({
        created: true,
        error: false,
      }),
    );
  }

  @Action(GameCreationFailure)
  onFailure() {
    return of(
      new UpdateGameStatus({
        created: false,
        error: true,
      }),
    );
  }

  @Action(ResetCurrentGame)
  onReset() {
    return of(
      new UpdateGameStatus({
        created: false,
        error: false,
      }),
    );
  }

  @Action(CreateGame)
  onCreateGame(_action, action$) {
    return action$.pipe(
      mapTo(new GameCreationSuccess()),
      catchError(() => of(new GameCreationFailure())),
    );
  }
}
