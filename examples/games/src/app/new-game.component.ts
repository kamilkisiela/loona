import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { pluck, takeUntil, mergeMap, mapTo } from 'rxjs/operators';

import { CurrentGame } from './interfaces';
import {
  createGameMutation,
  updateNameMutation,
  goalMutation,
  currentGameQuery,
  resetCurrentGameMutation,
} from './graphql';

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

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<{ currentGame: CurrentGame }>({
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
    this.apollo
      .mutate({
        mutation: updateNameMutation,
        variables: {
          team,
          name,
        },
      })
      .subscribe();
  }

  onGoal(team: 'A' | 'B'): void {
    this.apollo
      .mutate({
        mutation: goalMutation,
        variables: {
          team,
        },
      })
      .subscribe();
  }

  createGame(): void {
    this.apollo
      .mutate({
        mutation: createGameMutation,
        variables: {
          ...this.currentGame,
        },
      })
      .pipe(
        mergeMap(result =>
          this.apollo
            .mutate({
              mutation: resetCurrentGameMutation,
            })
            .pipe(mapTo(result)),
        ),
      )
      .subscribe({
        error: () => (this.error = true),
        next: () => (this.created = true),
      });
  }
}
