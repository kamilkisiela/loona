import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApolloFlux } from '@apollo-flux/angular';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';

import { CurrentGame } from './interfaces';
import {
  createGameMutation,
  currentGameQuery,
  resetCurrentGameMutation,
} from './graphql';
import { UpdateName, Goal, ResetCurrentGame } from './graphql/mutations';

@Component({
  selector: 'app-new-game',
  template: `
  <div class="pa4 flex flex-column items-center">
    <app-success *ngIf="created"></app-success>
    <app-error *ngIf="error"></app-error>

    <div class="flex justify-center">
      <app-team-card
        [name]="currentGame.teamAName"
        (changeName)="onChangeName('A', $event)"
        [goals]="currentGame.teamAScore"
        (goal)="onGoal('A')">
      </app-team-card>
      <app-team-card
        [name]="currentGame.teamBName"
        (changeName)="onChangeName('B', $event)"
        [goals]="currentGame.teamBScore"
        (goal)="onGoal('B')">
      </app-team-card>
    </div>

    <button (click)="createGame()" class="f6 link dim br3 ph3 pv2 mb2 dib white bg-blue no-outline">
      Game Finished
    </button>
  </div>
  `,
})
export class NewGameComponent implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  currentGame: CurrentGame = {
    teamAName: '',
    teamAScore: 0,
    teamBName: '',
    teamBScore: 0,
  };
  created = false;
  error = false;

  constructor(private flux: ApolloFlux, private apollo: Apollo) {}

  ngOnInit() {
    this.flux
      .query({
        query: currentGameQuery,
      })
      .valueChanges.pipe(
        takeUntil(this.destroyed),
        pluck('data', 'currentGame'),
      )
      .subscribe(result => {
        this.currentGame = result as any;
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onChangeName(team: 'A' | 'B', name: string): void {
    this.flux.dispatch(new UpdateName({ team, name }));
  }

  onGoal(team: 'A' | 'B'): void {
    this.flux.dispatch(new Goal({ team }));
  }

  createGame(): void {
    // TODO: create middleware (like Effect in ngrx)
    // TODO: to reset a game
    // TODO: and to set error or created

    // TODO: allow to call real mutations (that goes to an endpoint)

    this.flux.mutate({
      mutation: createGameMutation,
      variables: {
        ...this.currentGame,
      },
    });
  }
}
