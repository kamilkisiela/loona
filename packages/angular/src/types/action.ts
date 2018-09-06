import {MutationInfo, MutationObject} from '@loona/core';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';

export type ActionMethod = (
  action: any | MutationInfo,
  action$: Observable<any>,
) => void;

export interface ActionObject {
  type: string;
}

export type ActionDef = string | DocumentNode | ActionObject | MutationObject;
