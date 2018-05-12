import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo } from '../models';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  @Input() todos: Observable<Todo[]>;
  @Output('toggle') toggled = new EventEmitter<Todo>();

  constructor() {}

  ngOnInit() {}

  toggle(todo: Todo) {
    this.toggled.emit(todo);
  }

  trackByFn(i: number, todo: Todo) {
    return todo.id;
  }
}
