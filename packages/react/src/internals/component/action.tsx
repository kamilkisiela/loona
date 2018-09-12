import * as React from 'react';
import * as PropTypes from 'prop-types';
import {ActionObject, isMutation, MutationObject} from '@loona/core';

import {LoonaContext} from '../context';
import {Loona, getActionType} from '../client';

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
    return (actionOrPayload: ActionObject | MutationObject | any) => {
      if (!loona) {
        throw new Error('No Loona no fun!');
      }

      let action: ActionObject | MutationObject;

      if (isMutation(actionOrPayload)) {
        action = actionOrPayload;
      } else {
        action = this.props.action
          ? {
              type: this.props.action,
              ...actionOrPayload,
            }
          : {
              type: getActionType(actionOrPayload),
              ...actionOrPayload,
            };
      }

      loona.dispatch(action);
    };
  }

  render() {
    const {children} = this.props;

    return (
      <LoonaContext.Consumer>
        {({loona}) => {
          return children(this.createDispatch(loona));
        }}
      </LoonaContext.Consumer>
    );
  }
}
