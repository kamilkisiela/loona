import {MutationInfo, Context} from '@loona/core';

export type UpdateMethod = (
  action: MutationInfo,
  context: Context,
) => void;
