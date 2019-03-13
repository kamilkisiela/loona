import {decorate} from '@loona/react';
import {state, mutation, update} from '@loona/react';
import gql from 'graphql-tag';

// Actions

export class AddBook {
  static mutation = gql`
    mutation addBook($title: String!) {
      addBook(title: $title) @client
    }
  `;

  constructor(variables) {
    this.variables = variables;
  }
}

// GraphQL

export const allBooks = gql`
  query allBooks {
    books @client {
      id
      title
    }
  }
`;

export const recentBook = gql`
  query recentBook {
    recentBook @client {
      id
      title
    }
  }
`;

// State

export class BooksState {
  addBook({title}) {
    return {
      id: Math.random()
        .toString(16)
        .substr(2),
      title,
      __typename: 'Book',
    };
  }

  updateBooks(mutation, {patchQuery}) {
    patchQuery(allBooks, data => {
      data.books.push(mutation.result);
    });
  }

  setRecent(mutation, {patchQuery}) {
    patchQuery(recentBook, data => {
      data.recentBook = mutation.result;
    });
  }
}

// Define options
state({
  defaults: {
    books: [
      {
        id: Math.random()
          .toString(16)
          .substr(2),
        title: 'Harry Potter',
        __typename: 'Book',
      },
    ],
    recentBook: null,
  },
})(BooksState);

// Decorate the state
decorate(BooksState, {
  addBook: mutation(AddBook),
  updateBooks: update(AddBook),
  setRecent: update(AddBook),
});
