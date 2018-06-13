import { InjectionToken } from '@angular/core';
import { ApolloCache } from 'apollo-cache';
import { Manager as Connector } from '@apollo-flux/core';
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

export const CONNECTOR = new InjectionToken<Connector>(
  '[@apollo-flux/angular] Connector',
);

export const METADATA_KEY = '@@apollo-flux';
