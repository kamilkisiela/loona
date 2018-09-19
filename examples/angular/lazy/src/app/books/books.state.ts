import {
  State,
  Mutation,
  Context,
  Update,
  Effect,
  MutationAsAction,
} from '@loona/angular';
import {MatSnackBar} from '@angular/material';

import {generateID} from '../shared/utils';
import {AddBook, allBooks} from './books.actions';

const defaults = {
  books: [
    {
      id: generateID(),
      title: 'Book A',
      __typename: 'Book',
    },
  ],
};

@State({
  defaults,
})
export class BooksState {
  constructor(private snackBar: MatSnackBar) {}

  @Mutation(AddBook)
  addBook({title}) {
    return {
      id: generateID(),
      title,
      __typename: 'Book',
    };
  }

  @Update(AddBook)
  updateBooks(mutation, {patchQuery}: Context) {
    patchQuery(allBooks, data => {
      data.books.push(mutation.result);
    });
  }

  @Effect(AddBook)
  onBook(action: MutationAsAction) {
    let message: string;
    if (action.ok) {
      message = `Book '${action.options.variables.title}' added :)`;
    } else {
      message = `Adding book failed :(`;
    }

    this.snackBar.open(message, 'Got it', {
      duration: 2000,
    });
  }
}
