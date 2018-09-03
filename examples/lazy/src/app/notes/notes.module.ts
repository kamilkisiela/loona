import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoonaModule } from '@loona/angular';

import { NotesRoutingModule } from './notes-routing.module';
import { NotesComponent } from './notes.component';
import { NotesState } from './notes.state';

@NgModule({
  imports: [
    CommonModule,
    NotesRoutingModule,
    LoonaModule.forFeature([NotesState])
  ],
  declarations: [NotesComponent]
})
export class NotesModule { }
