import {Component, OnInit} from '@angular/core';
import {Loona} from '@loona/angular';
import {Observable} from 'rxjs';
import {pluck} from 'rxjs/operators';

import {AddBook, allBooks} from './books.state';

@Component({
  selector: 'app-books',
  template: `
    <button [disabled]="loading" (click)="random()">Random book</button>
    <ul>
      <li *ngFor="let book of books | async">
        {{book.title}}
      </li>
    </ul>
  `,
})
export class BooksComponent implements OnInit {
  books: Observable<any[]>;
  loading: boolean;

  constructor(private loona: Loona) {}

  ngOnInit() {
    this.books = this.loona
      .query(allBooks)
      .valueChanges.pipe(pluck('data', 'books'));
  }

  random() {
    this.loading = true;
    this.loona
      .mutate(AddBook.mutation, {
        title: Math.random()
          .toString()
          .substr(2),
      })
      .subscribe(() => {
        this.loading = false;
      });
  }
}
