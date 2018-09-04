import * as React from 'react';
import * as PropTypes from 'prop-types';
import {ApolloConsumer} from 'react-apollo';

import {Loona} from './internals/client';
import {LoonaContext} from './internals/context';

export interface LoonaProviderProps {
  children: React.ReactNode;
  states: any[];
}

export class LoonaProvider extends React.Component<LoonaProviderProps> {
  static propTypes = {
    states: PropTypes.array,
    children: PropTypes.node.isRequired,
  };

  render() {
    const {children, states} = this.props;

    return (
      <ApolloConsumer>
        {client => {
          return (
            <LoonaContext.Provider
              value={{
                loona: new Loona(client, states),
              }}
            >
              {children}
            </LoonaContext.Provider>
          );
        }}
      </ApolloConsumer>
    );
  }
}
