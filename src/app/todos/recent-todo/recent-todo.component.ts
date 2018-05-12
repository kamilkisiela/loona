import { Component, OnInit, Input } from '@angular/core';

import { Todo } from '../models';

@Component({
  selector: 'app-recent-todo',
  templateUrl: './recent-todo.component.html',
  styleUrls: ['./recent-todo.component.css'],
})
export class RecentTodoComponent implements OnInit {
  @Input() todo: Todo;

  constructor() {}

  ngOnInit() {}
}
