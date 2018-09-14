import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GraphQLModule} from './graphql.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    AppRoutingModule,
    GraphQLModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
