import { InjectionToken } from '@angular/core';

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
