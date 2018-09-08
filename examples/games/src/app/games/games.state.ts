import {
  State,
  Mutation,
  Effect,
  Resolve,
  Context,
  MutationAsAction,
} from '@loona/angular';
import {Observable} from 'rxjs';

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
    ctx.patchQuery(currentGameQuery, data => {
      // since it uses immer, you can mutate an object directly
      data.currentGame[`team${team}Name`] = name;
    });

    return null;
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
    ctx.patchQuery(currentGameQuery, data => {
      data.currentGame[`team${team}Score`] += 1;
    });

    return null;
  }

  @Mutation(UpdateGameStatus)
  updateGameStatus({created, error}, ctx: Context) {
    ctx.patchQuery(currentGameStatusQuery, data => {
      if (typeof created !== 'undefined') {
        data.currentGameStatus.created = created;
      }

      if (typeof error !== 'undefined') {
        data.currentGameStatus.error = error;
      }
    });

    return null;
  }

  @Mutation(ResetCurrentGame)
  resetCurrentGame(args, ctx: Context) {
    ctx.writeData({
      data: {
        currentGame: defaultState.currentGame,
      },
    });

    return null;
  }

  // Action handler - similar to NGRX Effects
  // called when action happens
  // returns a new acton or stops there
  @Effect(GameCreationSuccess)
  onSuccess(_, {dispatch}) {
    dispatch(
      new UpdateGameStatus({
        created: true,
        error: false,
      }),
    );
  }

  @Effect(GameCreationFailure)
  onFailure(_, {dispatch}) {
    dispatch(
      new UpdateGameStatus({
        created: false,
        error: true,
      }),
    );
  }

  @Effect(ResetCurrentGame)
  onReset(_, {dispatch}) {
    dispatch(
      new UpdateGameStatus({
        created: false,
        error: false,
      }),
    );
  }

  // Action handler that returns an action based on the result
  @Effect(CreateGame)
  onCreateGame(action: MutationAsAction, {dispatch}) {
    if (action.ok) {
      dispatch(new GameCreationSuccess());
    } else {
      dispatch(new GameCreationFailure());
    }
  }
}
