import gql from 'graphql-tag';

export class AddNote {
  static mutation = gql`
    mutation addNote($text: String!) {
      addNote(text: $text) @client
    }
  `;

  constructor(
    public variables: {
      text: string;
    },
  ) {}
}

export const allNotes = gql`
  query allNotes {
    notes @client {
      id
      text
    }
  }
`;
