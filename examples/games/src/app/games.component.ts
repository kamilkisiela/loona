import { Component, OnInit } from '@angular/core';
import { Luna } from '@luna/angular';
import { Observable } from 'rxjs';
import { pluck, share } from 'rxjs/operators';

import { Game } from './interfaces';
import { allGamesQuery } from './graphql';

@Component({
  selector: 'app-games',
  template: `
  <div class="pa4">
    <button class="f6 link dim br3 ph3 pv2 mb2 dib white bg-dark-gray" routerLink="/new-game">
      New Game
    </button>

    <div *ngIf="loading$ | async">
      Loading ...
    </div>

    <div class="overflow-auto" *ngIf="games$ | async as games">
      <table class="f6 w-100 mw8 center" cellSpacing="0">
        <thead>
          <tr class="stripe-dark">
            <th class="fw6 tl pa3 bg-white avenir">Team Name</th>
            <th class="fw6 tl pa3 bg-white avenir">Team Name</th>
            <th class="fw6 tl pa3 bg-white avenir">Score</th>
          </tr>
        </thead>
        <tbody class="lh-copy">
          <tr *ngFor="let game of games" class="stripe-dark">
            <td class="pa3 avenir">{{game.teamAName}}</td>
            <td class="pa3 avenir">{{game.teamBName}}</td>
            <td class="pa3 avenir">
              {{game.teamAScore}} - {{game.teamBScore}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
})
export class GamesComponent implements OnInit {
  games$: Observable<Game[]>;
  loading$: Observable<boolean>;

  constructor(private luna: Luna) {}

  ngOnInit() {
    const games$ = this.luna
      .query({
        query: allGamesQuery,
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(share());

    this.games$ = games$.pipe(pluck('data', 'allGames'));
    this.loading$ = games$.pipe(pluck('loading'));
  }
}
