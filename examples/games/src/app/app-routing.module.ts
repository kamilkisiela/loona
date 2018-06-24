import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { GamesComponent } from './games/games.component';
import { NewGameComponent } from './games/new-game.component';

const routes: Route[] = [
  {
    path: '',
    component: GamesComponent,
  },
  {
    path: 'new-game',
    component: NewGameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
