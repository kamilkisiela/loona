import { InjectionToken } from '@angular/core';
import { ApolloCache } from 'apollo-cache';

import { StateClass } from './types/state';

export const INITIAL_STATE = new InjectionToken<StateClass>(
  '[@luna/angular] State',
);

export const FEATURE_STATE = new InjectionToken<StateClass>(
  '[@luna/angular] Feature State',
);

export const APOLLO_CACHE = new InjectionToken<ApolloCache<any>>(
  '[@luna/angular] Cache',
);
