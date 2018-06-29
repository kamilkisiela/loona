import {Context} from './common';

export interface MutationInfo {
  name: string;
  variables?: Record<string, any>;
  result?: any;
}

export type UpdateResolveFn = (info: MutationInfo, context: Context) => void;

export interface UpdateDef {
  match: UpdateMatchFn;
  resolve: UpdateResolveFn;
}

export type UpdateMatchFn = (info: MutationInfo) => boolean;
