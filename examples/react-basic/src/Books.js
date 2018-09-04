import React from 'react';
import {Mutation} from '@loona/react';
import gql from 'graphql-tag';

export const addBook = gql`
  mutation addBook($title: String!) @client {
    addBook(title: $title)
  }
`;

export class Books extends React.Component {
  render() {
    return (
      <Mutation mutation={addBook}>
        {(mutate, {loading, data}) => (
          <React.Fragment>
            <button
              onClick={() =>
                mutate({
                  variables: {title: 'not random!'},
                })
              }
            >
              Add
              {loading ? 'ing' : ''} random book
            </button>
            {data && !loading ? `Added new book titled '${data.addBook.title}'` : null}
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}
