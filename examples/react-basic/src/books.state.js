import {decorate} from '@loona/react';
import {State, Mutation, Update, Listen} from '@loona/react/use/decorators';
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
  // TODO: let's change Mutation, Resolve, Query to Resolver
  // @Resolver(AddBook)
  // @Resolver('Mutation.addBook')
  // @Resolver(addBook)
  //
  // @Mutation(AddBook)
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

    console.log('book added');

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(book);
      }, 1000);
    });
  }

  // @Update(AddBook)
  updateBooks(mutation, {patchQuery}) {
    patchQuery(allBooks, data => {
      data.books.push(mutation.result);
    });
  }

  // TODO: leave Update as is
  // @Update(AddBook)
  setRecent(mutation, {patchQuery}) {
    patchQuery(recentBook, data => {
      data.recentBook = mutation.result;
    });
  }

  // TODO: make `action` to be a promise so we can handle .then and .catch
  // TODO: rename Action to Listen or something similar
  // @Listen(AddBook)
  onBook(action, { dispatch }) {
    console.log('[on action] onBook action', action);
    return dispatch(new BookAdded());
  }

  // @Listen(BookAdded)
  bookAdded(action) {
    console.log('[on action] book added');
  }

  // @Listen(AddRandomBook)
  addRandomBook(_, {dispatch}) {
    return dispatch(
      new AddBook({
        title: Math.random().toString(16),
      }),
    );
  }
}

State({
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
  addBook: Mutation(AddBook),
  addRandomBook: Listen(AddRandomBook),
  updateBooks: Update(AddBook),
  setRecent: Update(AddBook),
  onBook: Listen(AddBook),
  bookAdded: Listen(BookAdded),
});
