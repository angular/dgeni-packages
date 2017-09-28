import { Declaration, Expression, SyntaxKind, TypeNode, TypeParameterDeclaration } from 'typescript';
import { getTypeText } from './getTypeText';

export function getDeclarationTypeText(declaration: Declaration, namespacesToInclude: string[]) {
  // if the declaration has an explicit type then use that
  const type = getType(declaration);
  if (type) return getTypeText(type, namespacesToInclude);

  // if the declaration is a type parameter then just use its textual value
  if (declaration.kind === SyntaxKind.TypeParameter ) {
    return declaration.getText();
  }

  // if the declaration is being initialized then use the initialization value
  return getInitializerText(declaration);
}

function getType(declaration: Declaration) {
  return (declaration as any).type as TypeNode;
}

export function getInitializerText(declaration: Declaration) {
  const initializer = (declaration as any).initializer as Expression;
  return initializer ? initializer.getText() : '';
}
