import gql from 'graphql-tag';

export class AddNote {
  static mutation = gql`
    mutation addNote($text: String!) @client {
      addNote(text: $text)
    }
  `;

  constructor(
    public variables: {
      text: string;
    },
  ) {}
}

export const allNotes = gql`
  query allNotes @client {
    notes {
      id
      text
    }
  }
`;
