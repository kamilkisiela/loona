import {MutationObject, Context, Metadata as CoreMetadata} from '@loona/core';
import {DocumentNode} from 'graphql';
import {MutationOptions} from 'apollo-client';
import {FetchResult} from 'apollo-link';

export interface Metadata extends CoreMetadata {
  effects: Metadata.Effects;
}

export namespace Metadata {
  export type Effects = Record<
    string,
    Array<{propName: string; type: string; options: any}>
  >;
}

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
}

export type EffectDef = string | DocumentNode | ActionObject | MutationObject;

export interface ActionContext extends Context {
  dispatch: (action: ActionObject | MutationObject) => void;
}
