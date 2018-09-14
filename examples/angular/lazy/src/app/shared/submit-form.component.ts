import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'submit-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <mat-form-field>
        <input matInput [formControl]="value" [placeholder]="label">
      </mat-form-field>
      <button type="submit" mat-button>Submit</button>
    </form>
  `,
})
export class SubmitFormComponent {
  @Output('value')
  emitter = new EventEmitter<string>();
  @Input()
  label: string;
  value = new FormControl('');

  onSubmit() {
    if (this.value.value && (this.value.value as string).trim().length > 0) {
      this.emitter.next(this.value.value.trim());
      this.value.reset();
    }
  }
}
