import * as React from 'react';
import {
  Mutation as ApolloMutation,
  MutationProps as ApolloMutationProps,
  MutationFn,
} from 'react-apollo';
import {ApolloError} from 'apollo-client';

import {Loona} from '../internals/client';
import {LoonaContext} from '../internals/context';

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
      const promise = mutate(mutation);

      promise.then(() => {
        loona.dispatch(
          this.props.mutation
            ? {
                mutation: this.props.mutation,
                variables: mutation,
              }
            : mutation,
        );
      });

      return promise;
    };
  }

  render() {
    const {children} = this.props;

    return (
      <LoonaContext.Consumer>
        {({loona}) => {
          return (
            <ApolloMutation {...this.props}>
              {(mutation, result) =>
                children(this.createMutation(loona, mutation), result)
              }
            </ApolloMutation>
          );
        }}
      </LoonaContext.Consumer>
    );
  }
}
