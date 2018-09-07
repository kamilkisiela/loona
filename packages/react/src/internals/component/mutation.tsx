import * as React from 'react';
import {
  Mutation as ApolloMutation,
  MutationProps as ApolloMutationProps,
  MutationFn,
} from 'react-apollo';
import {ApolloError} from 'apollo-client';

import {Loona} from '../client';
import {LoonaContext} from '../context';

export interface MutationState<TData = any> {
  called: boolean;
  error?: ApolloError;
  data?: TData;
  loading: boolean;
}

export interface MutationProps extends ApolloMutationProps {
  loona?: Loona;
}

export class Mutation extends React.Component<MutationProps, MutationState> {
  static propTypes = ApolloMutation.propTypes;

  createMutation(loona: Loona | undefined, mutate: MutationFn) {
    if (!loona) {
      throw new Error('No Loona No Mutation!');
    }
    return (mutation: any) => {
      const config = this.props.mutation
        ? {
            mutation: this.props.mutation,
            ...mutation,
          }
        : mutation;
      const promise = mutate(config);

      promise.then(result => {
        loona.dispatch({
          type: 'mutation',
          options: config,
          ...result
        });
      });

      return promise;
    };
  }

  render() {
    const {children} = this.props;

    return (
      <LoonaContext.Consumer>
        {({client}) => {
          return (
            <ApolloMutation {...this.props}>
              {(mutation, result) =>
                children(this.createMutation(client, mutation), result)
              }
            </ApolloMutation>
          );
        }}
      </LoonaContext.Consumer>
    );
  }
}
