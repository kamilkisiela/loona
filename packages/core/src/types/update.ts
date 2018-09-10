import {Context} from './common';

export interface MutationInfo<R = any> {
  name: string;
  variables?: Record<string, any>;
  result?: R;
}

export type UpdateResolveFn = (info: MutationInfo, context: Context) => void;

export interface UpdateDef {
  mutation: string;
  resolve: UpdateResolveFn;
}

export type UpdateMethod = (action: MutationInfo, context: Context) => void;
