import { InjectionToken } from '@angular/core';
import { ApolloCache } from 'apollo-cache';
import { StateClass } from './state';

export const INITIAL_STATE = new InjectionToken<StateClass>(
  '[@apollo-flux/angular] State',
);

export const FEATURE_STATE = new InjectionToken<StateClass>(
  '[@apollo-flux/angular] Feature State',
);

export const APOLLO_CACHE = new InjectionToken<ApolloCache<any>>(
  '[@apollo-flux/angular] Cache',
);
