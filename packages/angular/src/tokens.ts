import {InjectionToken} from '@angular/core';
import {ApolloCache} from 'apollo-cache';

import {StateClass} from './types/state';

export const INITIAL_STATE = new InjectionToken<StateClass>('L State');

export const CHILD_STATE = new InjectionToken<StateClass>('L Child State');

export const LOONA_CACHE = new InjectionToken<ApolloCache<any>>('L Cache');
