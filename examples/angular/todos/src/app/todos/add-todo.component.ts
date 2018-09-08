import {Component, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-todo',
  template: `
    <form (submit)="submit()">
      <mat-form-field>
        <input matInput placeholder="What to do?" [formControl]="text">
      </mat-form-field>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }

      form > * {
        width: 100%;
      }
    `,
  ],
})
export class AddTodoComponent {
  @Output()
  todo = new EventEmitter<string>();
  text = new FormControl('', Validators.required);

  submit() {
    if (this.text.valid) {
      this.todo.next(this.text.value);
      this.text.reset();
    }
  }
}
