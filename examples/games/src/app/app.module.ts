import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { AppComponent } from './app.component';
import { GamesComponent } from './games/games.component';
import { NewGameComponent } from './games/new-game.component';
import { TeamCardComponent } from './games/team-card.component';
import { SuccessComponent } from './shared/success.component';
import { ErrorComponent } from './shared/error.component';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    NewGameComponent,
    TeamCardComponent,
    SuccessComponent,
    ErrorComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, GraphQLModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
