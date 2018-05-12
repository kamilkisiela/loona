import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

import { AppComponent } from './app.component';
import { TodosModule } from './todos/todos.module';
import { PostsModule } from './posts/posts.module';
import { ApolloFluxModule, INITIAL_APOLLO_OPTIONS } from './apollo-flux';
import { resolvers, defaults, typeDefs } from './todos/resolvers';
import { AddTodoMutation, ToggleTodoMutation } from './todos/flux/registry';
import { TodosUpdate, RecentTodoUpdate } from './todos/flux/updates';
import { UpvoteMutation } from './posts/flux/registry';

export function createApolloOptions(httpLink: HttpLink) {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: 'https://1jzxrj179.lp.gql.zone/graphql',
    }),
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloFluxModule.forRoot({
      state: {
        resolvers,
        defaults,
        typeDefs,
      },
      mutations: [AddTodoMutation, ToggleTodoMutation, UpvoteMutation],
      updates: [TodosUpdate, RecentTodoUpdate],
    }),
    TodosModule,
    PostsModule,
  ],
  providers: [
    {
      provide: INITIAL_APOLLO_OPTIONS,
      useFactory: createApolloOptions,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
