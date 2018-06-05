import { DocumentNode, OperationDefinitionNode, FieldNode } from 'graphql';
import { MatchFn } from './types';

export function ofName(name: string): MatchFn {
  return update => update.name === name;
}

export function getNameOfMutation(mutation: DocumentNode): string {
  const def = getMutationDefinition(mutation);
  const field = getFirstField(def);

  return field.name.value;
}

//

function getMutationDefinition(doc: DocumentNode): OperationDefinitionNode {
  const isMutation = (def: any): def is OperationDefinitionNode =>
    def.kind === 'OperationDefinition' && def.operation === 'mutation';
  const defs = doc.definitions.filter(isMutation);

  if (!defs || !defs[0]) {
    throw new Error('Must contain a mutation definition.');
  }

  return defs[0];
}

function getFirstField(def: OperationDefinitionNode): FieldNode {
  return def.selectionSet.selections[0] as FieldNode;
}
