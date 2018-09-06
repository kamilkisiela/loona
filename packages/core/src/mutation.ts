import {DocumentNode} from 'graphql';
import {MutationDef, MutationObject} from './types/mutation';
import {Store} from './internal/store';
import {getMutationDefinition, getFirstField} from './internal/utils';

export class MutationManager extends Store<MutationDef> {
  constructor(defs?: MutationDef[]) {
    super();

    if (defs) {
      defs.forEach(def => {
        this.set(def.mutation, def);
      });
    }
  }

  add(defs: MutationDef[]): void {
    defs.forEach(def => {
      this.set(def.mutation, def);
    });
  }
}

export function mutationToType(action: MutationObject): string {
  const mutation = getMutation(action);
  const name = getNameOfMutation(mutation);

  return name;
}

export function getMutation(action: any): DocumentNode {
  if (action.constructor && action.constructor.mutation) {
    return action.constructor.mutation;
  }

  return action.mutation;
}

export function isMutation(action: any): action is MutationObject {
  return typeof getMutation(action) !== 'undefined';
}

export function getNameOfMutation(mutation: DocumentNode): string {
  const def = getMutationDefinition(mutation);
  const field = getFirstField(def);

  return field.name.value;
}
