import { HttpClient } from '@angular/common/http';
import { Observable, of, empty } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
  constructor(private http: HttpClient, private mutations$: any) {}

  @Query()
  searchTodos(_: never, args: any): Observable<Todo[]> {
    return this.http
      .get<{ items: Todo[] }>(`http://api.example?q=${args.text}`)
      .pipe(map(todos => todos.items || []));
  }

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

  @Update()
  todoAdded$: Observable<Todo> = this.mutations$.pipe(
    ofName('addTodo'),
    switchMap(_update => {
      // const todo = update.result;
      // const cache = update.cache;
      // cache.readQuery -> cache.writeQuery
      return empty();
    }),
  );
}
