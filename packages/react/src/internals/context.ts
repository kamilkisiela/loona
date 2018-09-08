import * as React from 'react';
import {LoonaLink} from '@loona/core';
import {Loona} from './client';

interface LoonaContext {
  loona?: LoonaLink;
  client?: Loona;
}

export const LoonaContext = React.createContext<LoonaContext>({});
