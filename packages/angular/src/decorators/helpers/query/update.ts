import {MutationInfo, Context} from '@loona/core';
import {DocumentNode} from 'graphql';
import produce from 'immer';

import {hasMutation} from '../../../metadata/mutation';

export function UpdateQuery<State, ArgsOrResult, Ctx>(query: DocumentNode) {
  return (
    target: any,
    propName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    console.log('UpdateQuery: update descriptor');
    const fn = descriptor.value.bind(target);

    descriptor.value = (rootOrInfo: any, args: any, context: any) => {
      if (hasMutation(target, propName)) {
        console.log('Patch: has @Mutation');
        updateQueryInMutation<State, ArgsOrResult, Ctx>(query, fn)(
          rootOrInfo,
          args,
          context,
        );
      } else {
        console.log('Patch: has @OnMutation');
        descriptor.value = updateQueryAfterMutation<State, ArgsOrResult, Ctx>(
          query,
          fn,
        )(rootOrInfo, context);
      }
      // return updateQuery(query, fn, args, context);
    };

    // if (hasMutation(target, propName)) {
    //   console.log('Patch: has @Mutation');
    //   descriptor.value = updateQueryInMutation<State, ArgsOrResult, Ctx>(
    //     query,
    //     fn,
    //   );
    // } else {
    //   console.log('Patch: has @OnMutation');
    //   descriptor.value = updateQueryAfterMutation<State, ArgsOrResult, Ctx>(
    //     query,
    //     fn,
    //   );
    // }

    return descriptor;
  };
}

// @Mutation(mutation)
// @Update(query)
function updateQueryInMutation<State, Args, Ctx>(
  query: DocumentNode,
  fn: (val: State, args: Args, ctx: Ctx) => State | void,
) {
  return (_root: any, args: Args, context: Ctx & Context) => {
    return updateQuery(query, fn, args, context);
  };
}

// @OnMutation(mutation)
// @Update(query)
function updateQueryAfterMutation<State, Result, Ctx>(
  query: DocumentNode,
  fn: (
    state: State,
    info: MutationInfo<Result>,
    context: Ctx & Context,
  ) => State | void,
) {
  return (info: MutationInfo<Result>, context: Ctx & Context) => {
    return updateQuery(query, fn, info, context);
  };
}

function updateQuery<State, ArgsOrInfo, Ctx>(
  query: DocumentNode,
  fn: any,
  argsOrInfo: ArgsOrInfo,
  context: Ctx & Context,
) {
  const cache = context.cache;
  const state = cache.readQuery<State>({query}) as State;
  const data = produce<State>(state, draft => fn(draft, argsOrInfo, context));

  cache.writeData<State>({data});

  return data;
}
