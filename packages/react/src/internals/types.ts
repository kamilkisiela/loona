import {
  Metadata as CoreMetadata,
  MutationInfo,
  Context,
  MutationObject,
} from '@loona/core';

export interface ActionContext extends Context {
  dispatch<T>(action: MutationObject | ActionObject): Promise<T> | T | void;
}

export type ActionMethod<T> = (
  action: any | MutationInfo,
  context: ActionContext,
) => T | ActionMethod<T> | void;

export interface ActionObject {
  type: string;
  [key: string]: any;
}

export interface Metadata extends CoreMetadata {
  actions: Metadata.Actions;
}

export namespace Metadata {
  export type Actions = Record<
    string,
    Array<{propName: string; type: string; options: any}>
  >;
}
