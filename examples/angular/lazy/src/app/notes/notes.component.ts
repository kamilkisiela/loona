import {Component, OnInit} from '@angular/core';
import {Loona} from '@loona/angular';
import {Observable} from 'rxjs';
import {pluck, map} from 'rxjs/operators';

import {AddNote, allNotes} from './notes.state';

@Component({
  selector: 'app-notes',
  template: `
    <submit-form label="Note" (value)="onNote($event)"></submit-form>
    <list title="Notes" [list]="notes | async"></list>
  `,
})
export class NotesComponent implements OnInit {
  notes: Observable<any[]>;

  constructor(private loona: Loona) {}

  ngOnInit() {
    this.notes = this.loona.query(allNotes).valueChanges.pipe(
      pluck('data', 'notes'),
      map((notes: any) => {
        if (notes) {
          return notes.map(note => ({
            title: note.text,
            subtitle: `ID:${note.id}`,
          }));
        }

        return notes;
      }),
    );
  }

  onNote(text: string) {
    this.loona.dispatch(
      new AddNote({
        text,
      }),
    );
  }
}
