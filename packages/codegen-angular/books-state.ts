import {State, Mutation, Context} from '@loona/angular';
import gql from 'graphql-tag';

export interface Book {
  id: string;
  title: string;
}

export interface Query {
  books: Book[];
}

export interface Mutation {
  addBook(title: string): Book;
}

const addBookMutation = gql`
  mutation addBook($title: String!) {
    addBook(title: $title) {
      id
      title
    }
  }
`;

export class AddBook {
  static mutation = addBookMutation;

  constructor(public variables: {title: string}) {}
}

interface AddBookArgs {
  title: string;
}

@State({
  defaults: {
    books: [],
  },
})
export class BooksState {
  @Mutation(AddBook)
  addBook(args: AddBookArgs, context: Context): Promise<Book> | Book {
    return;
  }
}
