import React from 'react';
import Typography from '@material-ui/core/Typography';
import BookIcon from '@material-ui/icons/Book';
import {Query} from '@loona/react';

import {allBooks} from './books.state';
import {List} from '../common/List';

export function BooksList() {
  return (
    <div style={{marginTop: 25}}>
      <Typography variant="headline">Books</Typography>
      <Query query={allBooks}>
        {({data, loading}) => {
          if (loading) return '...';

          return (
            <List
              icon={<BookIcon />}
              list={data.books.map(book => ({id: book.id, label: book.title}))}
            />
          );
        }}
      </Query>
    </div>
  );
}
