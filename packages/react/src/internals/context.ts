import * as React from 'react';
import {Loona} from './client';

interface LoonaContext {
  loona?: Loona;
}

export const LoonaContext = React.createContext<LoonaContext>({});
