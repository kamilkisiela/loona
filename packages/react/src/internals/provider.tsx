import * as React from 'react';
import * as PropTypes from 'prop-types';
import {ApolloConsumer} from 'react-apollo';
import {Manager} from '@loona/core';

import {Loona} from './client';
import {LoonaContext} from './context';

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
        {apolloClient => {
          return (
            <LoonaContext.Provider
              value={{
                loona: new Loona(
                  apolloClient,
                  new Manager({getClient: () => apolloClient}),
                  states,
                ),
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
