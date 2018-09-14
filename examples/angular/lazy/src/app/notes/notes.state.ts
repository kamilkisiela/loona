import {State, Mutation, Context, Effect} from '@loona/angular';
import {MatSnackBar} from '@angular/material';
import gql from 'graphql-tag';

import {generateID} from '../shared/utils';

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
        id: generateID(),
        text: 'Note A',
        __typename: 'Note',
      },
    ],
  },
})
export class NotesState {
  constructor(private snackBar: MatSnackBar) {}

  @Mutation(AddNote)
  addNote({text}, {patchQuery}: Context) {
    const note = {
      id: generateID(),
      text,
      __typename: 'Note',
    };

    patchQuery(allNotes, data => {
      data.notes.push(note);
    });

    return note;
  }

  @Effect(AddNote)
  onNote(action) {
    let message: string;
    if (action.ok) {
      message = `Note added :)`;
    } else {
      message = `Adding note failed :(`;
    }

    this.snackBar.open(message, 'Got it', {
      duration: 2000,
    });
  }
}
