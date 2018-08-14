import {MutationInfo, Context} from '@loona/core';
import {DocumentNode} from 'graphql';

import {getKind} from '../../internal/utils';
import {UpdateQuery} from './query/update';
import {UpdateFragment} from './fragment/update';

export function Patch<State = any, Args = Record<string, any>, Ctx = any>(
  doc: DocumentNode,
  getId?: (args: Args) => string,
): (
  target: any,
  propName: string,
  descriptor: TypedPropertyDescriptor<
    (state: State, args: Args, context: Context & Ctx) => State | void
  >,
) => TypedPropertyDescriptor<(...args: any[]) => State | void>;

export function Patch<State = any, Result = any, Ctx = any>(
  doc: DocumentNode,
  getId?: (args: MutationInfo<Result>) => string,
): (
  target: any,
  propName: string,
  descriptor: TypedPropertyDescriptor<
    (
      state: State,
      info: MutationInfo<Result>,
      context: Context & Ctx,
    ) => State | void
  >,
) => TypedPropertyDescriptor<(...args: any[]) => State | void>;

export function Patch<
  State = any,
  ArgsOrResult = Record<string, any> | any,
  Ctx = any
>(doc: DocumentNode) {
  switch (getKind(doc)) {
    case 'query':
      return UpdateQuery<State, ArgsOrResult, Ctx>(doc);

    case 'fragment':
      return UpdateFragment<State, ArgsOrResult, Ctx>(doc);

    default:
      return () => {
        throw new Error('Patch have to be used with a query or a fragment');
      };
  }
}
