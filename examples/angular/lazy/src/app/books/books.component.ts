import {Component, OnInit} from '@angular/core';
import {Loona} from '@loona/angular';
import {Observable} from 'rxjs';
import {pluck, map} from 'rxjs/operators';

import {AddBook, allBooks} from './books.actions';

@Component({
  selector: 'app-books',
  template: `
    <submit-form label="Title" (value)="onBook($event)"></submit-form>
    <list title="List of books" [list]="books | async"></list>
  `,
})
export class BooksComponent implements OnInit {
  books: Observable<any[]>;
  loading: boolean;

  constructor(private loona: Loona) {}

  ngOnInit() {
    this.books = this.loona.query(allBooks).valueChanges.pipe(
      pluck('data', 'books'),
      map((books: any) => {
        if (books) {
          return books.map(book => ({
            title: book.title,
            subtitle: `ID:${book.id}`,
          }));
        }

        return books;
      }),
    );
  }

  onBook(title: string) {
    this.loona
      .mutate(AddBook.mutation, {
        title,
      })
      .subscribe();
  }
}
