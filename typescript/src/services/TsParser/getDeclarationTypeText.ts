import { Declaration, Node, SyntaxKind, TypeNode, TypeParameterDeclaration } from 'typescript';
import { getTypeText } from './getTypeText';
import { nodeToString } from './nodeToString';

export function getDeclarationTypeText(declaration: Declaration) {
  // if the declaration has an explicit type then use that
  const type = getType(declaration);
  if (type) return getTypeText(type);

  // if the declaration is a type parameter then just use its textual value
  if (declaration.kind === SyntaxKind.TypeParameter ) {
    return nodeToString(declaration);
  }

  // if the declaration is being initialized then use the initialization value
  const initializer = getInitializer(declaration);
  return initializer ? nodeToString(initializer) : '';
}

function getType(declaration: Declaration) {
  return (declaration as any).type as TypeNode;
}

export function getInitializer(declaration: Declaration) {
  return (declaration as any).initializer as Node;
}
