import * as React from 'react';
import * as PropTypes from 'prop-types';
import {ActionObject} from '@loona/core';

import {LoonaContext} from '../context';
import {Loona} from '../client';

export interface ActionProps {
  action?: string;
  children: (dispatchFn: (action?: ActionObject) => void) => React.ReactNode;
}

export class Action extends React.Component<ActionProps> {
  static propTypes = {
    action: PropTypes.any,
    children: PropTypes.func.isRequired,
  };

  createDispatch(loona?: Loona) {
    return (actionOrPayload: any) => {
      if (!loona) {
        throw new Error('No Loona no fun!');
      }

      loona.dispatch(
        this.props.action
          ? {
              type: this.props.action,
              ...actionOrPayload,
            }
          : actionOrPayload,
      );
    };
  }

  render() {
    const {children} = this.props;

    return (
      <LoonaContext.Consumer>
        {({client}) => {
          return children(this.createDispatch(client));
        }}
      </LoonaContext.Consumer>
    );
  }
}
