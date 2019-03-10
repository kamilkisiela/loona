import {InjectionToken} from '@angular/core';
import {StateClass, Metadata} from '@loona/core';

export const INITIAL_STATE = new InjectionToken<StateClass<Metadata>>(
  'Loona/State',
);
export const CHILD_STATE = new InjectionToken<StateClass<Metadata>>(
  'Loona/ChildState',
);

export const INIT = '@@init';
export const ROOT_EFFECTS_INIT = '@@effects/init';
export const UPDATE_EFFECTS = '@@effects/update';
