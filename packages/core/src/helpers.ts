import {DocumentNode, FragmentDefinitionNode} from 'graphql';
import produce from 'immer';

import {ReceivedContext} from './types/common';
import {getMutationDefinition, getFirstField} from './internal/utils';

export function getNameOfMutation(mutation: DocumentNode): string {
  const def = getMutationDefinition(mutation);
  const field = getFirstField(def);

  return field.name.value;
}

export function getFragmentTypename(fragment: DocumentNode): string {
  const def = fragment.definitions.find(def => def.kind === 'FragmentDefinition') as FragmentDefinitionNode;

  return def.typeCondition.name.value;
}

export function writeFragment(
  fragment: DocumentNode,
  obj: any,
  context: ReceivedContext,
) {
  context.cache.writeFragment({
    fragment,
    id: context.getCacheKey(obj),
    data: {
      ...obj,
      __typename: getFragmentTypename(fragment),
    },
  });
}

export function readFragment(
  fragment: DocumentNode,
  obj: any,
  context: ReceivedContext,
) {
  return context.cache.readFragment({
    fragment,
    id: context.getCacheKey(obj),
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
    const data = produce(frgmt, patchFn);

    writeFragment(fragment, data, context);

    return data;
  };
}
