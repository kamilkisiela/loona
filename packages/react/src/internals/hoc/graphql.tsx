import * as React from 'react';
import {DocumentNode} from 'graphql';
import {
  graphql as apolloGraphql,
  OperationOption,
  DataProps,
  MutateProps,
} from 'react-apollo';

import {withMutation} from './with-mutation';
import {isMutationType} from '../utils';

export function graphql<
  TProps extends TGraphQLVariables | {} = {},
  TData = {},
  TGraphQLVariables = {},
  TChildProps = Partial<DataProps<TData, TGraphQLVariables>> &
    Partial<MutateProps<TData, TGraphQLVariables>>
>(
  document: DocumentNode,
  operationOptions: OperationOption<
    TProps,
    TData,
    TGraphQLVariables,
    TChildProps
  > = {},
): (
  wrapped: React.ComponentType<TChildProps & TProps>,
) => React.ComponentClass<TProps> {
  if (isMutationType(document)) {
    return withMutation(document, operationOptions);
  }

  return apolloGraphql(document, operationOptions);
}
