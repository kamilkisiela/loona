import {Component} from '@angular/core';
import {Loona} from '@loona/angular';
import {Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';

import {AddTodo, ToggleTodo} from './todos/todos.actions';
import {activeTodos, completedTodos} from './todos/todos.graphql';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <app-add-todo (todo)="add($event)"></app-add-todo>
      <div class="split">
        <div class="into">
          <app-todos-list name="Active" [todos]="active | async" position="before" (toggle)="toggle($event)"></app-todos-list>
        </div>
        <div class="into">
          <app-todos-list name="Completed" [todos]="completed | async" position="after" (toggle)="toggle($event)"></app-todos-list>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: block;
        max-width: 600px;
        margin: 0 auto;
      }

      .split {
        display: flex;
        justify-content: space-between;

        .into {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      }
    `,
  ],
})
export class AppComponent {
  active: Observable<any[]>;
  completed: Observable<any[]>;

  constructor(private loona: Loona) {
    this.active = this.loona
      .query({
        query: activeTodos,
      })
      .valueChanges.pipe(pluck('data', 'active'));

    this.completed = this.loona
      .query({
        query: completedTodos,
      })
      .valueChanges.pipe(pluck('data', 'completed'));
  }

  add(text: string): void {
    this.loona.dispatch(new AddTodo(text));
  }

  toggle(id: string): void {
    this.loona.dispatch(new ToggleTodo(id));
  }
}
