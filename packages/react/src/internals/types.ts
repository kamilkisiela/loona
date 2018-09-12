import {MutationObject, ActionObject} from '@loona/core';

export type Dispatch = (action: MutationObject | ActionObject) => void;
