import { EntityName, Identifier, SyntaxKind, TypeNode, TypeReferenceNode } from 'typescript';

export function getTypeText(type: TypeNode): string {
    if (type.kind === SyntaxKind.TypeReference) {
      // we have a type reference, so recurse down to find the unqualified name
      return getTypeReferenceText(type as TypeReferenceNode);
    } else {
      // we have a straightforward type
      return type.getText();
    }
}

function getTypeReferenceText(typeRef: TypeReferenceNode): string {
  const typeName = getUnqualifiedName(typeRef.typeName);
  if (typeRef.typeArguments) {
    // The type is a generic so we must also get the unqualified names of each type
    const typeArguments = typeRef.typeArguments.map(typeArgument => getTypeText(typeArgument));
    return `${typeName.getText()}<${typeArguments.join(', ')}>`;
  }
  return typeName.getText();
}

function getUnqualifiedName(name: EntityName): Identifier {
  while (name.kind === SyntaxKind.QualifiedName) {
    name = name.right;
  }
  return name;
}
