import {DataProxy} from 'apollo-cache';

import {ReceivedContext, Context} from '../types/common';
import {patchQuery, patchFragment} from '../helpers';

export function buildContext(context: ReceivedContext): Context {
  return {
    ...context,
    patchQuery: patchQuery(context),
    patchFragment: patchFragment(context),
    writeData(options: DataProxy.WriteDataOptions<any>) {
      return context.cache.writeData(options);
    },
  };
}
