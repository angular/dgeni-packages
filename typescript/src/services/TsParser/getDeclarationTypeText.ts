import { Declaration, Expression, SyntaxKind, TypeNode, TypeParameterDeclaration } from 'typescript';
import { getTypeText } from './getTypeText';

export function getDeclarationTypeText(declaration: Declaration) {
  // if the declaration has an explicit type then use that
  const type = getType(declaration);
  if (type) return getTypeText(type);

  // if the declaration is a type parameter then just use its textual value
  if (declaration.kind === SyntaxKind.TypeParameter ) {
    return declaration.getText();
  }

  // if the declaration is being initialized then use the initialization value
  const initializer = getInitializer(declaration);
  if (initializer) return initializer.getText();

  return '';
}

function getType(declaration: Declaration) {
  return (declaration as any).type as TypeNode;
}

function getInitializer(declaration: Declaration) {
  return (declaration as any).initializer as Expression;
}
