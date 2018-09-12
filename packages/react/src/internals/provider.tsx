import * as React from 'react';
import * as PropTypes from 'prop-types';
import {ApolloConsumer} from 'react-apollo';
import {LoonaLink} from '@loona/core';

import {Loona} from './client';
import {LoonaContext} from './context';

export interface LoonaProviderProps {
  children: React.ReactNode;
  loona: LoonaLink;
  states: any[];
}

export class LoonaProvider extends React.Component<LoonaProviderProps> {
  static propTypes = {
    states: PropTypes.array,
    loona: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const {children, loona, states} = this.props;

    return (
      <ApolloConsumer>
        {apolloClient => {
          return (
            <LoonaContext.Provider
              value={{
                loona: new Loona(apolloClient, loona.manager, states),
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
