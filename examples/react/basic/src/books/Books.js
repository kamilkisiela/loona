import React from 'react';

import {BookForm} from './BookForm';
import {BooksList} from './BooksList';
import {RecentBook} from './RecentBook';

export class Books extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BookForm label="Title" />
        <RecentBook />
        <BooksList />
      </React.Fragment>
    );
  }
}
