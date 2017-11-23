import { createPrinter, EntityName, Identifier, SyntaxKind, TypeNode, TypeReferenceNode } from 'typescript';
import { nodeToString } from './nodeToString';

export function getTypeText(type: TypeNode, namespacesToInclude: string[]): string {
  if (type.kind === SyntaxKind.TypeReference) {
    // we have a type reference, so recurse down to find the unqualified name
    return getTypeReferenceText(type as TypeReferenceNode, namespacesToInclude);
  } else {
    // we have a straightforward type
    return nodeToString(type);
  }
}

function getTypeReferenceText(typeRef: TypeReferenceNode, namespacesToInclude: string[]): string {
  const typeName = getUnqualifiedName(typeRef.typeName, namespacesToInclude);
  if (typeRef.typeArguments) {
    // The type is a generic so we must also get the unqualified names of each type
    const typeArguments = typeRef.typeArguments.map(typeArgument => getTypeText(typeArgument, namespacesToInclude));
    return `${typeName}<${typeArguments.join(', ')}>`;
  }
  return typeName;
}

function getUnqualifiedName(name: EntityName, namespacesToInclude: string[]): string {
  const nameParts: string[] = [];
  while (name.kind === SyntaxKind.QualifiedName) {
    const qualification = nodeToString(name.left);
    if (namespacesToInclude.indexOf(qualification) !== -1) {
      nameParts.push(qualification);
    }
    name = name.right;
  }
  nameParts.push(nodeToString(name));
  return nameParts.join('.');
}
