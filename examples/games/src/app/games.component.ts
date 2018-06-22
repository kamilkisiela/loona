import { Component, OnInit } from '@angular/core';
import { ApolloFlux } from '@apollo-flux/angular';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { Game } from './interfaces';
import { allGamesQuery } from './graphql';

@Component({
  selector: 'app-games',
  template: `
  <div class="pa4">
    <button class="f6 link dim br3 ph3 pv2 mb2 dib white bg-dark-gray" routerLink="/new-game">
      New Game
    </button>

    <div class="overflow-auto">
      <table class="f6 w-100 mw8 center" cellSpacing="0">
        <thead>
          <tr class="stripe-dark">
            <th class="fw6 tl pa3 bg-white avenir">Team Name</th>
            <th class="fw6 tl pa3 bg-white avenir">Team Name</th>
            <th class="fw6 tl pa3 bg-white avenir">Score</th>
          </tr>
        </thead>
        <tbody class="lh-copy">
          <tr *ngFor="let game of games | async" class="stripe-dark">
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
  games: Observable<Game[]>;

  constructor(private apollo: ApolloFlux) {}

  ngOnInit() {
    this.games = this.apollo
      .query({
        query: allGamesQuery,
        fetchPolicy: 'cache-and-network',
      })
      .valueChanges.pipe(pluck('data', 'allGames'));
  }
}
