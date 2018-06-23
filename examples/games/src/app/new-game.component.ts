import { Component, OnInit } from '@angular/core';
import { ApolloFlux } from '@apollo-flux/angular';
import { Observable } from 'rxjs';
import { pluck, share, tap } from 'rxjs/operators';

import { CurrentGame, CurrentGameStatus } from './interfaces';
import { currentGameQuery, currentGameStatusQuery } from './graphql';
import {
  UpdateName,
  Goal,
  ResetCurrentGame,
  CreateGame,
} from './graphql/actions';

@Component({
  selector: 'app-new-game',
  template: `
  <div class="pa4 flex flex-column items-center">
    <app-success *ngIf="created$ | async">
      <button class="f6 link dim br3 ph3 pv2 mb2 dib white bg-dark-gray" (click)="startNewGame()">Start New Game</button>
    </app-success>
    <app-error *ngIf="error$ | async">
      <button class="f6 link dim br3 ph3 pv2 mb2 dib white bg-dark-gray" (click)="startNewGame()">Start New Game</button>
    </app-error>

    <div class="flex justify-center" *ngIf="currentGame$ | async as currentGame">
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
export class NewGameComponent implements OnInit {
  currentGame$: Observable<CurrentGame>;
  error$: Observable<boolean>;
  created$: Observable<boolean>;
  private currentGame: CurrentGame;

  constructor(private flux: ApolloFlux) {}

  ngOnInit() {
    this.currentGame$ = this.flux
      .query({
        query: currentGameQuery,
      })
      .valueChanges.pipe(
        pluck<any, CurrentGame>('data', 'currentGame'),
        tap(currentGame => (this.currentGame = currentGame)),
      );

    const status$ = this.flux
      .query({
        query: currentGameStatusQuery,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        pluck<any, CurrentGameStatus>('data', 'currentGameStatus'),
        share(),
      );

    this.error$ = status$.pipe(pluck('error'));
    this.created$ = status$.pipe(pluck('created'));
  }

  onChangeName(team: 'A' | 'B', name: string): void {
    this.flux.dispatch(new UpdateName(team, name));
  }

  onGoal(team: 'A' | 'B'): void {
    this.flux.dispatch(new Goal(team));
  }

  startNewGame(): void {
    this.flux.dispatch(new ResetCurrentGame());
  }

  createGame(): void {
    this.flux.mutate(new CreateGame(this.currentGame));
  }
}
