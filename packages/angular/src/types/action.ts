import {MutationInfo} from '@loona/core';
import {Observable} from 'rxjs';

export type ActionMethod = (
  action: any | MutationInfo,
  action$: Observable<any>,
) => void;
