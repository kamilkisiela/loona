import {DocumentNode} from 'graphql';
import {MutationOptions} from 'apollo-client';
import {FetchResult} from 'apollo-link';

import {Context} from './common';
import {MutationObject} from './mutation';

export type EffectMethod = (
  action: Action | MutationAsAction,
  context: ActionContext,
) => void;

export interface ActionObject {
  type: string;
}

export type Action = ActionObject | MutationAsAction;

export interface MutationAsAction extends FetchResult<any> {
  type: string;
  options: MutationOptions;
  ok: boolean;
}

export type EffectDef = string | DocumentNode | ActionObject | MutationObject;

export interface ActionContext extends Context {
  dispatch: (action: ActionObject | MutationObject) => void;
}
