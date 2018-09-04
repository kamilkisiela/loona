import {State, Mutation, Action, Resolve, Context} from '@loona/angular';
import {of, Observable} from 'rxjs';
import {mapTo, catchError, map} from 'rxjs/operators';

import {currentGameQuery} from './graphql/current-game.query';
import {currentGameStatusQuery} from './graphql/current-game-status.query';
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
  // registers and creates a resolver for the mutation
  @Mutation(UpdateName)
  updateName({team, name}, ctx: Context) {
    return ctx.patchQuery(currentGameQuery, data => {
      // since it uses immer, you can mutate an object directly
      data.currentGame[`team${team}Name`] = name;
    });
  }

  @Resolve('Query.count')
  count() {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(10);

        setTimeout(() => {
          observer.next(20);
          observer.complete();
        }, 2000);
      }, 2000);
    });
  }

  @Mutation(Goal)
  goal({team}, ctx: Context) {
    console.log(ctx);
    return ctx.patchQuery(currentGameQuery, data => {
      data.currentGame[`team${team}Score`] += 1;
    });
  }

  @Mutation(UpdateGameStatus)
  updateGameStatus({created, error}, ctx: Context) {
    return ctx.patchQuery(currentGameStatusQuery, data => {
      if (typeof created !== 'undefined') {
        data.currentGameStatus.created = created;
      }

      if (typeof error !== 'undefined') {
        data.currentGameStatus.error = error;
      }
    });
  }

  @Mutation(ResetCurrentGame)
  resetCurrentGame(args, ctx: Context) {
    return ctx.writeData({
      data: {
        currentGame: defaultState.currentGame,
      },
    });
  }

  // Action handler - similar to NGRX Effects
  // called when action happens
  // returns a new acton or stops there
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

  // Action handler that returns an action based on the result
  @Action(CreateGame)
  onCreateGame(payload, action$) {
    return action$.pipe(
      mapTo(new GameCreationSuccess()),
      catchError(() => of(new GameCreationFailure())),
    );
  }
}
