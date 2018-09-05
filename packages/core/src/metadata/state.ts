import {ensureMetadata} from './metadata';
import {StateOptions} from '../types/state';

export function setStateMetadata(target: any, options?: StateOptions<any>) {
  const meta = ensureMetadata(target);

  if (typeof options !== 'undefined') {
    meta.defaults = options.defaults;
    meta.typeDefs = options.typeDefs;
  }
}
