import {DocumentNode, OperationDefinitionNode, FieldNode} from 'graphql';

export function getMutationDefinition(
  doc: DocumentNode,
): OperationDefinitionNode {
  const isMutation = (def: any): def is OperationDefinitionNode =>
    def.kind === 'OperationDefinition' && def.operation === 'mutation';
  console.log('doc.definitions', doc.definitions);
  const defs = doc.definitions.filter(isMutation);

  if (!defs || !defs[0]) {
    throw new Error('Must contain a mutation definition.');
  }

  return defs[0];
}

export function getFirstField(def: OperationDefinitionNode): FieldNode {
  return def.selectionSet.selections[0] as FieldNode;
}
