import {
  State,
  Mutation,
  Context,
  Update,
  Effect,
  MutationAsAction,
} from '@loona/angular';
import {MatSnackBar} from '@angular/material';
import gql from 'graphql-tag';

import {generateID} from '../shared/utils';

export class AddBook {
  static mutation = gql`
    mutation addBook($title: String!) @client {
      addBook(title: $title)
    }
  `;

  constructor(
    public variables: {
      title: string;
    },
  ) {}
}

export const allBooks = gql`
  query allBooks @client {
    books {
      id
      title
    }
  }
`;

@State({
  defaults: {
    books: [
      {
        id: generateID(),
        title: 'Book A',
        __typename: 'Book',
      },
    ],
  },
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
