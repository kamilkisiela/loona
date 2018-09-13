import * as React from 'react';
import {DocumentNode} from 'graphql';
import {graphql, OperationOption, MutateProps} from 'react-apollo';

import {LoonaContext} from '../context';
import {wrapMutation} from '../component/mutation';
import {getDisplayName} from '../utils';

export function withMutation<
  TProps extends TGraphQLVariables | {} = {},
  TData = {},
  TGraphQLVariables = {},
  TChildProps = Partial<MutateProps<TData, TGraphQLVariables>>
>(
  document: DocumentNode,
  operationOptions: OperationOption<
    TProps,
    TData,
    TGraphQLVariables,
    TChildProps
  > = {},
) {
  return (
    WrappedComponent: React.ComponentType<TChildProps & TProps>,
  ): React.ComponentClass<TProps> => {
    const name = operationOptions.name || 'mutate';
    const wrappedComponentName = getDisplayName(WrappedComponent);
    const displayName = `LoonaMutate(${wrappedComponentName})`;

    function GraphQLComponent(props: any) {
      const mutate = props[name];

      return (
        <LoonaContext.Consumer>
          {({loona}) => {
            const childProps = {
              [name]: wrapMutation(loona, mutate, document),
            };
            return <WrappedComponent {...props} {...childProps} />;
          }}
        </LoonaContext.Consumer>
      );
    }

    (GraphQLComponent as any).displayName = displayName;
    (GraphQLComponent as any).WrappedComponent = WrappedComponent;

    return graphql(document, operationOptions)(GraphQLComponent);
  };
}
