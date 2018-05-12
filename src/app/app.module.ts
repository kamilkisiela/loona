import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { persistCache } from 'apollo-cache-persist';
import { RetryLink } from 'apollo-link-retry';
import { ApolloLink } from 'apollo-link';
import QueueLink from 'apollo-link-queue';

import { AppComponent } from './app.component';
import { TodosModule } from './todos/todos.module';
import { PostsModule } from './posts/posts.module';
import { SharedModule } from './shared/shared.module';
import { NetworkGate } from './shared/network.service';

// flux
import { ApolloFluxModule, INITIAL_APOLLO_OPTIONS } from './apollo-flux';
import { resolvers, defaults, typeDefs } from './todos/resolvers';
import { AddTodoMutation, ToggleTodoMutation } from './todos/flux/registry';
import { TodosUpdate, RecentTodoUpdate } from './todos/flux/updates';
import { UpvoteMutation } from './posts/flux/registry';

const queue = new QueueLink() as any;

export function createApolloOptions(httpLink: HttpLink) {
  const cache = new InMemoryCache();

  const retry = new RetryLink({
    delay: count => Math.min(300 * 2 ** count, 10000),
    attempts: {
      max: Number.POSITIVE_INFINITY,
    },
  });

  persistCache({
    cache,
    storage: localStorage,
    key: 'todo-app',
    debounce: 300,
  });

  const http = httpLink.create({
    uri: 'https://1jzxrj179.lp.gql.zone/graphql',
  });

  const link = ApolloLink.from([retry, queue, http]);

  return {
    cache,
    link,
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
    SharedModule,
    TodosModule,
    PostsModule,
  ],
  providers: [
    {
      provide: INITIAL_APOLLO_OPTIONS,
      useFactory: createApolloOptions,
      deps: [HttpLink],
    },
    {
      provide: NetworkGate,
      useValue: queue,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
