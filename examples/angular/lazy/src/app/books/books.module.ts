import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoonaModule} from '@loona/angular';

import {BooksRoutingModule} from './books-routing.module';
import {BooksComponent} from './books.component';
import {BooksState} from './books.state';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    BooksRoutingModule,
    LoonaModule.forChild([BooksState]),
  ],
  declarations: [BooksComponent],
})
export class BooksModule {}
