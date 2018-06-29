import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-todos-list',
  template: `
    <h2 class="name">{{name}}</h2>
    <mat-selection-list>
      <mat-list-option *ngFor="let todo of todos" [selected]="todo.completed" (click)="toggled(todo)" [checkboxPosition]="position" [ngClass]="{'rtl': position === 'after'}" >
        {{todo.text}}
      </mat-list-option>
    </mat-selection-list>
  `,
  styles: [
    `
      .name {
        font-family: Roboto, 'Helvetica Neue', sans-serif;
      }

      .rtl {
        text-align: right;
      }
    `,
  ],
})
export class TodosListComponent {
  @Input() position = 'before';
  @Input() todos = [];
  @Input() name: string;
  @Output() toggle = new EventEmitter<string>();

  toggled(todo) {
    this.toggle.next(todo.id);
  }
}
