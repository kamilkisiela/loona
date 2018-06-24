import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-team-card',
  template: `
    <article class="mw5 bg-white br3 pa3 pa4-ns mv3 ba b--black-10 pa3 mr2">
      <div class="tc">
        <div class="measure">
          <label for="name" class="f6 b db mb2">
            Team A Name
          </label>
          <input
            [value]="name"
            id="name"
            (change)="changeName.emit($event.target.value)"
            class="input-reset ba b--black-20 pa2 mb2 db w-100"
            type="text"
          />
        </div>
        <h2 class="f5 fw4 gray mt0 avenir">{{goals}}</h2>
        <button (click)="goal.emit()" class="f6 link dim br3 ph3 pv2 mb2 dib white bg-blue no-outline">
          Goal
        </button>
      </div>
    </article>
  `,
})
export class TeamCardComponent {
  @Input() name: string;
  @Input() goals: number;
  @Output() goal = new EventEmitter<void>();
  @Output() changeName = new EventEmitter<string>();
}
