import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent {
  @Output('todo') submitted = new EventEmitter<string>();

  submit(text: string) {
    this.submitted.emit(text);

    return false;
  }
}
