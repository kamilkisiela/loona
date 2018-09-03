import {Component, OnInit} from '@angular/core';
import {Loona} from '@loona/angular';
import {Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';

import {AddNote, allNotes} from './notes.state';

@Component({
  selector: 'app-notes',
  template: `
    <button (click)="random()">Random note</button>
    <ul>
      <li *ngFor="let note of notes | async">
        {{note.text}}
      </li>
    </ul>
  `,
})
export class NotesComponent implements OnInit {
  notes: Observable<any[]>;

  constructor(private loona: Loona) {}

  ngOnInit() {
    this.notes = this.loona
      .query({
        query: allNotes,
      })
      .valueChanges.pipe(pluck('data', 'notes'));
  }

  random() {
    this.loona.dispatch(
      new AddNote({
        text: Math.random()
          .toString()
          .substr(2),
      }),
    );
  }
}
