import {
  DocumentNode,
  FragmentDefinitionNode,
  OperationDefinitionNode,
} from 'graphql';
import {DataProxy} from 'apollo-cache';
import produce from 'immer';

import {ReceivedContext, Context} from './types/common';
import {Action, MutationAsAction} from './types/effect';

export function buildContext(context: ReceivedContext): Context {
  return {
    ...context,
    patchQuery: patchQuery(context),
    patchFragment: patchFragment(context),
    writeData(options: DataProxy.WriteDataOptions<any>) {
      return context.cache.writeData(options);
    },
  };
}

export function getFragmentTypename(fragment: DocumentNode): string {
  const def = fragment.definitions.find(
    def => def.kind === 'FragmentDefinition',
  ) as FragmentDefinitionNode;

  return def.typeCondition.name.value;
}

export function writeFragment(
  fragment: DocumentNode,
  obj: any,
  context: ReceivedContext,
) {
  const __typename = getFragmentTypename(fragment);
  const data = {...obj, __typename};

  context.cache.writeFragment({
    fragment,
    id: context.getCacheKey(data),
    data,
  });
}

export function readFragment(
  fragment: DocumentNode,
  obj: any,
  context: ReceivedContext,
) {
  return context.cache.readFragment({
    fragment,
    id: context.getCacheKey({
      ...obj,
      __typename: getFragmentTypename(fragment),
    }),
  });
}

export function writeQuery(obj: any, context: ReceivedContext) {
  context.cache.writeData({
    data: obj,
  });
}

export function readQuery<R = any>(
  query: DocumentNode,
  context: ReceivedContext,
): R | null {
  return context.cache.readQuery({
    query,
  });
}

export function patchQuery(context: ReceivedContext) {
  return <R = any>(query: DocumentNode, patchFn: (data: R) => any): R => {
    const obj = readQuery(query, context);
    const data = produce(obj, patchFn);

    writeQuery(data, context);

    return data;
  };
}

export function patchFragment(context: ReceivedContext) {
  return <R = any>(
    fragment: DocumentNode,
    obj: any,
    patchFn: (data: R) => any,
  ): R => {
    const frgmt: any = readFragment(fragment, obj, context);
    const data = produce(frgmt, data => patchFn(data));

    writeFragment(fragment, data, context);

    return data;
  };
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export function getKind(doc: DocumentNode): 'fragment' | 'query' | undefined {
  if (isFragment(doc)) {
    return 'fragment';
  }

  if (isQuery(doc)) {
    return 'query';
  }
}

export function isFragment(doc: DocumentNode): boolean {
  return doc.definitions[0].kind === 'FragmentDefinition';
}

export function isQuery(doc: DocumentNode): boolean {
  return (
    doc.definitions[0].kind === 'OperationDefinition' &&
    (doc.definitions[0] as OperationDefinitionNode).operation === 'query'
  );
}

export function isDocument(doc: any): doc is DocumentNode {
  return doc && doc.kind === 'Document';
}

export function isPromise<T = any>(val: any): val is Promise<T> {
  return val instanceof Promise;
}

export function isMutationAsAction(action: Action): action is MutationAsAction {
  return action.type === 'mutation';
}
