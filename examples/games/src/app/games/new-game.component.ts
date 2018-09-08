import {Component, OnInit} from '@angular/core';
import {Loona} from '@loona/angular';
import {Observable} from 'rxjs';
import {pluck, share, tap} from 'rxjs/operators';

import {CurrentGame, CurrentGameStatus} from './interfaces';
import {currentGameQuery} from './graphql/current-game.query';
import {currentGameStatusQuery} from './graphql/current-game-status.query';
import {UpdateName, Goal, ResetCurrentGame, CreateGame} from './games.actions';

@Component({
  selector: 'app-new-game',
  template: `
  <div class="pa4 flex flex-column items-center">
    <app-success *ngIf="created$ | async">
      Game Created. Go back to
      <button class="f6 link dim br3 ph3 pv2 mb2 dib white bg-dark-gray" routerLink="/">
        Homepage
      </button>
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

  constructor(private loona: Loona) {}

  ngOnInit() {
    this.currentGame$ = this.loona.query(currentGameQuery).valueChanges.pipe(
      pluck<any, CurrentGame>('data', 'currentGame'),
      tap(currentGame => (this.currentGame = currentGame)),
    );

    const status$ = this.loona.query(currentGameStatusQuery).valueChanges.pipe(
      pluck<any, CurrentGameStatus>('data', 'currentGameStatus'),
      share(),
    );

    this.error$ = status$.pipe(pluck('error'));
    this.created$ = status$.pipe(pluck('created'));
  }

  onChangeName(team: 'A' | 'B', name: string): void {
    console.log('on change name', team, name);
    // that's how to dispatch an action
    this.loona.dispatch(new UpdateName({team, name}));
  }

  onGoal(team: 'A' | 'B'): void {
    this.loona.dispatch(new Goal(team));
  }

  startNewGame(): void {
    this.loona.dispatch(new ResetCurrentGame());
  }

  createGame(): void {
    this.loona.dispatch(new CreateGame(this.currentGame));
  }
}
