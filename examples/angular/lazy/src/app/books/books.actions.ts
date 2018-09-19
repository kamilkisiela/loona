import gql from 'graphql-tag';

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
