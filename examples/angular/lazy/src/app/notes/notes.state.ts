import {State, Mutation, Context} from '@loona/angular';
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

@State({
  defaults: {
    notes: [
      {
        id: 1,
        text: 'Note A',
        __typename: 'Note',
      },
    ],
  },
})
export class NotesState {
  @Mutation(AddNote)
  addNote({text}, {patchQuery}: Context) {
    const note = {
      id: parseInt(
        Math.random()
          .toString()
          .substr(2),
      ),
      text,
      __typename: 'Note',
    };

    patchQuery(allNotes, data => {
      data.notes.push(note);
    });

    return note;
  }
}
