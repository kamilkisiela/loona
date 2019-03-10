import {DocumentNode, FragmentDefinitionNode} from 'graphql';
import {ApolloClient} from 'apollo-client';
import produce from 'immer';

import {ReceivedContext, Context} from './types/common';
import {Action, MutationAsAction} from './types/effect';

export function buildContext(
  context: ReceivedContext,
  client: ApolloClient<any>,
): Context {
  return {
    ...context,
    client,
    patchQuery: patchQuery(client),
    patchFragment: patchFragment(context, client),
    writeData: client.writeData,
  };
}

// we can pick that from ApolloClient
export function buildGetCacheKey(cache: any) {
  return (obj: {__typename: string; id: string | number}) => {
    if ((cache as any).config) {
      return (cache as any).config.dataIdFromObject(obj);
    } else {
      throw new Error(
        'To use context.getCacheKey, you need to use a cache that has a configurable dataIdFromObject, like apollo-cache-inmemory.',
      );
    }
  };
}

export function getFragmentTypename(fragment: DocumentNode): string {
  const def = fragment.definitions.find(
    def => def.kind === 'FragmentDefinition',
  ) as FragmentDefinitionNode;

  return def.typeCondition.name.value;
}

export function patchQuery(client: ApolloClient<any>) {
  return <R = any>(
    query:
      | DocumentNode
      | {
          query: DocumentNode;
          variables: {
            [key: string]: any;
          };
        },
    patchFn: (data: R) => any,
  ): R => {
    const options = isDocument(query) ? {query} : query;
    const obj: any = client.readQuery(options);
    const data = produce(obj, patchFn);

    client.writeQuery({
      ...options,
      data,
    });

    return data;
  };
}

export function patchFragment(
  context: ReceivedContext,
  client: ApolloClient<any>,
) {
  return <R = any>(
    fragment: DocumentNode,
    obj: any,
    patchFn: (data: R) => any,
  ): R => {
    const __typename = getFragmentTypename(fragment);
    const id = context.getCacheKey({
      ...obj,
      __typename,
    });

    const frgmt: any = client.readFragment({
      fragment,
      id,
    });
    const data = produce(frgmt, patchFn);

    client.writeFragment({
      fragment,
      id,
      data: {
        ...data,
        __typename,
      },
    });

    return data;
  };
}

export function isDocument(doc: any): doc is DocumentNode {
  return doc && doc.kind === 'Document';
}

export function isMutationAsAction(action: Action): action is MutationAsAction {
  return action.type === 'mutation';
}

export function getActionType(action: any): string {
  if (action.constructor && action.constructor.type) {
    return action.constructor.type;
  }

  return action.type;
}
