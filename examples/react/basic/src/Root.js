import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import {Books} from './books/Books';

export function Root() {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Loona Example
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{padding: 15}}>
        <Books />
      </div>
    </React.Fragment>
  );
}
