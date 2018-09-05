import {Metadata as CoreMetadata} from '@loona/core';

export interface Metadata extends CoreMetadata {
  actions: Metadata.Actions;
}

export namespace Metadata {
  export type Actions = Record<
    string,
    Array<{propName: string; type: string; options: any}>
  >;
}
