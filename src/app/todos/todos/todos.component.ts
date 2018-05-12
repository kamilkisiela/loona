import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

import { ApolloFlux } from '../../apollo-flux';
import { Todo } from '../models';
import { AddTodoMutation, ToggleTodoMutation } from '../flux/mutations';
import { todosQuery, recentTodoQuery } from '../flux/queries';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  todos: Observable<Todo[]>;
  recentTodo: Observable<Todo>;

  constructor(private apolloFlux: ApolloFlux) {}

  ngOnInit() {
    this.todos = this.apolloFlux
      .query<{ todos: Todo[] }>({
        query: todosQuery,
      })
      .valueChanges.pipe(map(result => result.data.todos));

    this.recentTodo = this.apolloFlux
      .query<{ recentTodo: Todo }>({
        query: recentTodoQuery,
      })
      .valueChanges.pipe(map(result => result.data.recentTodo));
  }

  onTodo(text: string) {
    this.apolloFlux.dispatch(new AddTodoMutation(text));
  }

  onToggle(todo: Todo) {
    this.apolloFlux.dispatch(new ToggleTodoMutation(todo.id));
  }
}
