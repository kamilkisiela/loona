import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AppComponent } from './app.component';
import { TodosModule } from './todos/todos.module';
import { ApolloFluxModule } from './apollo-flux/apollo-flux.module';
import { resolvers, defaults, typeDefs } from './todos/resolvers';
import { AddTodoMutation, ToggleTodoMutation } from './todos/flux/registry';
import { TodosUpdate, RecentTodoUpdate } from './todos/flux/updates';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TodosModule,
    ApolloFluxModule.forRoot({
      state: {
        resolvers,
        defaults,
        typeDefs,
      },
      mutations: [AddTodoMutation, ToggleTodoMutation],
      updates: [TodosUpdate, RecentTodoUpdate],
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
