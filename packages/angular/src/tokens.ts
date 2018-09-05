import {InjectionToken} from '@angular/core';
import {ApolloCache} from 'apollo-cache';
import {StateClass} from '@loona/core';

import {Metadata} from './types/metadata';

export const INITIAL_STATE = new InjectionToken<StateClass<Metadata>>(
  'L State',
);
export const CHILD_STATE = new InjectionToken<StateClass<Metadata>>(
  'L Child State',
);
export const LOONA_CACHE = new InjectionToken<ApolloCache<any>>('L Cache');
