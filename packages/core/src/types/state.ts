import {METADATA_KEY} from '../metadata/metadata';
import {Metadata} from './metadata';

export interface StateClass<T = Metadata> {
  [METADATA_KEY]: T;
}

export interface StateOptions<T> {
  defaults?: T;
  typeDefs?: string | string[];
}
