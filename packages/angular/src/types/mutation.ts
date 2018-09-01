import {Context} from '@loona/core';

export type MutationMethod = (
  args: Record<string, any>,
  context: Context,
) => any;
