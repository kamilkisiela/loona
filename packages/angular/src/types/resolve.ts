import {Context} from '@loona/core';

export type ResolveMethod = (
  parent: any,
  args: Record<string, any>,
  context: Context,
) => any;
