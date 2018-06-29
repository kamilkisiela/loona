import {Context} from '../types/common';
import {MutationInfo} from '../types/update';
import {UpdateManager} from '../update';

export function runUpdates({
  updates,
  info,
  context,
}: {
  updates: UpdateManager;
  info: MutationInfo;
  context: Context;
}): void {
  if (!updates) {
    return;
  }

  updates.get().forEach(update => {
    if (update.match(info)) {
      update.resolve(info, context);
    }
  });
}
