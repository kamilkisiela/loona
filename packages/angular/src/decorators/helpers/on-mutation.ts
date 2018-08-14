import {getNameOfMutation} from '@loona/core';

import {Update} from '../../decorators/update';

export function OnMutation(mutation: any) {
  console.log('onMutation', getNameOfMutation(mutation));
  return Update(info => info.name === getNameOfMutation(mutation));
}
