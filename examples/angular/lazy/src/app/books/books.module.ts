import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoonaModule} from '@loona/angular';

import {BooksRoutingModule} from './books-routing.module';
import {BooksComponent} from './books.component';
import {BooksState} from './books.state';

@NgModule({
  imports: [
    CommonModule,
    BooksRoutingModule,
    LoonaModule.forChild([BooksState]),
  ],
  declarations: [BooksComponent],
})
export class BooksModule {}
