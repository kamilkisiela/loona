import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Query} from '@loona/react';

import {recentBook} from './books.state';

export function RecentBook() {
  return (
    <Query query={recentBook}>
      {({data, loading}) => {
        if (loading) return '';

        if (!data.recentBook) {
          return null;
        }

        return (
          <Typography variant="caption">
            Added book: {data.recentBook.title}
          </Typography>
        );
      }}
    </Query>
  );
}
