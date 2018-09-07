import {InjectionToken} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {StateClass} from '@loona/core';

import {Metadata} from './types';

export const INITIAL_STATE = new InjectionToken<StateClass<Metadata>>(
  'Loona/State',
);
export const CHILD_STATE = new InjectionToken<StateClass<Metadata>>(
  'Loona/ChildState',
);
export const LOONA_CACHE = new InjectionToken<ApolloCache<any>>('Loona/Cache');
