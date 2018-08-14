import {Context, MutationInfo} from '@loona/core';
import {DocumentNode} from 'graphql';
import produce from 'immer';

import {hasMutation} from '../../../metadata/mutation';

export function UpdateFragment<State, ArgsOrResult, Ctx>(
  fragment: DocumentNode,
  getId: (args: ArgsOrResult | MutationInfo<ArgsOrResult>) => string = (
    args: any,
  ) => args.id,
) {
  return (
    target: any,
    propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const fn = descriptor.value.bind(target);

    if (hasMutation(target, propName)) {
      descriptor.value = updateFragmentInMutation<State, ArgsOrResult, Ctx>(
        fragment,
        getId,
        fn,
      );
    } else {
      descriptor.value = updateFragmentAfterMutation<State, ArgsOrResult, Ctx>(
        fragment,
        getId,
        fn,
      );
    }

    return descriptor;
  };
}

// @Mutation(mutation)
// @Update(fragment)
function updateFragmentInMutation<State, Args, Ctx>(
  fragment: DocumentNode,
  getId: (args: Args) => string,
  fn: (val: State, args: Args, ctx: Ctx) => State | void,
) {
  return (_root: any, args: Args, context: Ctx & Context) => {
    return updateFragment(fragment, getId, fn, args, context);
  };
}

// @OnMutation(mutation)
// @Update(fragment)
function updateFragmentAfterMutation<State, Result, Ctx>(
  fragment: DocumentNode,
  getId: (args: MutationInfo<Result>) => string,
  fn: (
    state: State,
    info: MutationInfo<Result>,
    context: Ctx & Context,
  ) => State | void,
) {
  return (info: MutationInfo<Result>, context: Ctx & Context) => {
    return updateFragment(fragment, getId, fn, info, context);
  };
}

function updateFragment<State, ArgsOrInfo, Ctx>(
  fragment: DocumentNode,
  getId: (args: ArgsOrInfo) => string,
  fn: any,
  argsOrInfo: ArgsOrInfo,
  context: Ctx & Context,
): State {
  const cache = context.cache;
  const id = getId(argsOrInfo);
  const state = cache.readFragment<State>({fragment, id}) as State;
  const data = produce<State>(state, draft => fn(draft, argsOrInfo, context));

  cache.writeFragment<State>({fragment, id, data});

  return data;
}
