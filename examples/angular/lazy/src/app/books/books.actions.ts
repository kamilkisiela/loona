import gql from 'graphql-tag';

export class AddBook {
  static mutation = gql`
    mutation addBook($title: String!) {
      addBook(title: $title) @client
    }
  `;

  constructor(
    public variables: {
      title: string;
    },
  ) {}
}

export const allBooks = gql`
  query allBooks {
    books @client {
      id
      title
    }
  }
`;
