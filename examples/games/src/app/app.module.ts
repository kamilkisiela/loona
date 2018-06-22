import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql/graphql.module';
import { AppComponent } from './app.component';
import { GamesComponent } from './games.component';
import { NewGameComponent } from './new-game.component';
import { TeamCardComponent } from './team-card.component';
import { SuccessComponent } from './success.component';
import { ErrorComponent } from './error.component';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
