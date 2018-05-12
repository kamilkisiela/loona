import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent implements OnInit {
  @Output('todo') submitted = new EventEmitter<string>();

  ngOnInit() {}

  submit(text: string) {
    this.submitted.emit(text);

    return false;
  }
}
