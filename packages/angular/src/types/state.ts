import { METADATA_KEY } from '../metadata/metadata';
import { Metadata } from '../types/metadata';

export interface StateClass {
  [METADATA_KEY]: Metadata;
}

export interface StateOptions<T> {
  defaults?: T;
  typeDefs?: string | string[];
}
