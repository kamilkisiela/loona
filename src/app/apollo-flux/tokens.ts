import { InjectionToken } from '@angular/core';
import { ApolloClientOptions } from 'apollo-client';

import { State, MutationDef, UpdateFn } from './models';

export const INITIAL_STATE = new InjectionToken<State>(
  '[Apollo Flux] Initial state',
);
export const INITIAL_MUTATIONS = new InjectionToken<MutationDef>(
  '[Apollo Flux] Initial mutations',
);
export const INITIAL_UPDATES = new InjectionToken<UpdateFn>(
  '[Apollo Flux] Initial updates',
);
export const INITIAL_APOLLO_OPTIONS = new InjectionToken<
  ApolloClientOptions<any>
>('[Apollo Flux] Initial Apollo Options');
