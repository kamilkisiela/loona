import {decorate} from '@loona/react';
import {state, mutation, update, effect} from '@loona/react';
import gql from 'graphql-tag';

export class BookAdded {
  static type = 'BookAdded';
}

export class AddRandomBook {
  static type = 'Add random book';
}

export class AddBook {
  static mutation = gql`
    mutation addBook($title: String!) @client {
      addBook(title: $title)
    }
  `;

  constructor(variables) {
    this.variables = variables;
  }
}

export const allBooks = gql`
  query allBooks @client {
    books {
      id
      title
    }
  }
`;

export const recentBook = gql`
  query recentBook @client {
    recentBook {
      id
      title
    }
  }
`;

export class BooksState {
  // @mutation(AddBook)
  addBook({title}) {
    const book = {
      id: parseInt(
        Math.random()
          .toString()
          .substr(2),
        10,
      ),
      title,
      __typename: 'Book',
    };

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(book);
      }, 1000);
    });
  }

  // @update(AddBook)
  updateBooks(mutation, {patchQuery}) {
    patchQuery(allBooks, data => {
      data.books.push(mutation.result);
    });
  }

  // @update(AddBook)
  setRecent(mutation, {patchQuery}) {
    patchQuery(recentBook, data => {
      data.recentBook = mutation.result;
    });
  }

  // @effect(AddBook)
  onBook(action, {dispatch}) {
    dispatch(new BookAdded());
  }

  // @affect(BookAdded)
  bookAdded(action) {
    console.log('[app] bookAdded');
  }

  // @effect(AddRandomBook)
  addRandomBook(_, {dispatch}) {
    dispatch(
      new AddBook({
        title: Math.random().toString(16),
      }),
    );
  }
}

state({
  defaults: {
    books: [
      {
        id: 1,
        title: 'Book A',
        __typename: 'Book',
      },
    ],
    recentBook: null,
  },
})(BooksState);

decorate(BooksState, {
  addBook: mutation(AddBook),
  addRandomBook: effect(AddRandomBook),
  updateBooks: update(AddBook),
  setRecent: update(AddBook),
  onBook: effect(AddBook),
  bookAdded: effect(BookAdded),
});
