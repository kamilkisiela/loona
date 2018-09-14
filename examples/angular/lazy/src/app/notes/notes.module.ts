import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoonaModule} from '@loona/angular';

import {NotesRoutingModule} from './notes-routing.module';
import {NotesComponent} from './notes.component';
import {NotesState} from './notes.state';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    NotesRoutingModule,
    LoonaModule.forChild([NotesState]),
  ],
  declarations: [NotesComponent],
})
export class NotesModule {}
