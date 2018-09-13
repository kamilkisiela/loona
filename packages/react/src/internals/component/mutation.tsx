import * as React from 'react';
import {
  Mutation as ApolloMutation,
  MutationProps as ApolloMutationProps,
  MutationFn,
} from 'react-apollo';
import {ApolloError} from 'apollo-client';
import {DocumentNode} from 'graphql';
import {withUpdates} from '@loona/core';

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

  render() {
    const {children} = this.props;

    return (
      <LoonaContext.Consumer>
        {({loona}) => (
          <ApolloMutation {...this.props}>
            {(mutation, result) =>
              children(
                wrapMutation(loona, mutation, this.props.mutation),
                result,
              )
            }
          </ApolloMutation>
        )}
      </LoonaContext.Consumer>
    );
  }
}

export function wrapMutation(
  loona: Loona | undefined,
  mutate: MutationFn,
  doc?: DocumentNode,
) {
  if (!loona) {
    throw new Error('No Loona No Mutation!');
  }
  return (mutation: any) => {
    const config = doc
      ? {
          mutation: doc,
          ...mutation,
        }
      : {...mutation};
    const promise = mutate(withUpdates(config, loona.manager));

    loona.wrapMutation(promise as any, config, false);

    return promise;
  };
}
