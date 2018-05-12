import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TodosModule } from './todos/todos.module';
import { ApolloFluxModule } from './apollo-flux/apollo-flux.module';
import { resolvers, defaults, typeDefs } from './todos/resolvers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TodosModule,
    ApolloFluxModule.forRoot({
      resolvers,
      defaults,
      typeDefs,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
