import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Query } from './query';
import { State } from './state';
import { Mutation } from './mutation';
import { Update, ofName } from './update';

const query: any = 'query';

const update = ({ result, cache }: any) => {
  const previous: any = cache.readQuery({ query });
  const data = { todos: previous.todos.concat([result]) };

  return (transformFn: any) => {
    cache.writeData({ data: transformFn(previous, data) });
  };
};

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

@State({
  defaults: {
    todos: [],
  },
  typeDefs: `
    type Todo {
      id: String
      text: String
      completed: Boolean
    }

    type Query {
      searchTodos(text: String!): Todo[]
    }

    type Mutation {
      addTodo(text: String!): Todo
    }
  `,
})
export class TodoState {
  constructor(private http: HttpClient) {}
  // maybe introduce `@Type` that would resolve Types

  // maybe `name` in options
  @Query()
  searchTodos(_: never, args: any): Observable<Todo[]> {
    return this.http
      .get<{ items: Todo[] }>(`http://api.example?q=${args.text}`)
      .pipe(map(todos => todos.items || []));
  }

  // maybe `name` in options
  @Mutation()
  addTodo(_: never, args: any): Observable<Todo> {
    const todo = {
      id: Math.random()
        .toString(36)
        .substr(2),
      text: args.text,
      completed: false,
      __typename: 'Todo',
    };

    return of(todo);
  }

  // How to do define an Update?

  // most advanced way
  @Update({
    match: ofName('addTodo'),
  })
  todoAdded({ result, cache }: any) {
    const previous: any = cache.readQuery({ query });
    const data = { todos: previous.todos.concat([result]) };

    cache.writeData({ data });
  }

  // the simplest way
  @Update({
    match: ofName('addTodo'),
    query,
  })
  todoAddedShort(data: any, todo: any) {
    return { todos: data.todos.concat([todo]) };
  }

  // maybe introduce a higher order function to keep one behavior of an Update
  @Update()
  asd = update(query)((data: any, todo: any) => ({
    todos: data.todos.concat([todo]),
  }));
}

// with angular

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { FluxLink } from '@apollo-flux/core';
import { FluxModule, Manager } from '.';

const cache = new InMemoryCache();

@NgModule({
  imports: [
    BrowserModule,
    ApolloModule,
    FluxModule.forRoot(cache, [TodoState]),
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [Manager],
    },
  ],
})
export class AppModule {}

export function createApollo(manager: Manager) {
  return {
    cache,
    // TODO: let manager handle defaults and typeDefsg
    link: new FluxLink(manager),
  };
}
