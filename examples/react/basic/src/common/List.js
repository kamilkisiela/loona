import React from 'react';
import MaterialList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export function List(props) {
  if (props.list) {
    return (
      <MaterialList>
        {props.list.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </MaterialList>
    );
  } else {
    return '';
  }
}
