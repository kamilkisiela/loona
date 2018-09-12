import {
  State,
  Mutation,
  Context,
  Update,
  Effect,
  MutationAsAction,
  EffectContext,
} from '@loona/angular';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';

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
        id: 1,
        title: 'Book A',
        __typename: 'Book',
      },
    ],
  },
})
export class BooksState {
  @Mutation(AddBook)
  addBook({title}) {
    const book = {
      id: parseInt(
        Math.random()
          .toString()
          .substr(2),
      ),
      title,
      __typename: 'Book',
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(book);
        observer.complete();
        console.log('completed');
      }, 1000);
    });
  }

  @Update(AddBook)
  updateBooks(mutation, {patchQuery}: Context) {
    console.log('!! update books');
    patchQuery(allBooks, data => {
      data.books.push(mutation.result);
    });
  }

  @Effect(AddBook)
  onBook(action: MutationAsAction, context: EffectContext) {
    console.log('!! book added', {
      action,
      context,
    });

    context.dispatch({
      type: 'something',
      foo: 12,
    });
  }

  @Effect('something')
  something(action) {
    console.log('something!!', action);
  }
}
