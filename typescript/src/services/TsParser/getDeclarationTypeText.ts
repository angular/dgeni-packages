import * as ts from 'typescript';
import { getTypeText } from './getTypeText';
import { nodeToString } from './nodeToString';

export function getDeclarationTypeText(declaration: ts.Declaration): string {
  // if the declaration has an explicit type then use that
  const type = getType(declaration);
  if (type) return getTypeText(type);

  // if the declaration is a type parameter then just use its textual value
  if (ts.isTypeParameterDeclaration(declaration)) {
    return nodeToString(declaration);
  }

  // if the declaration is being initialized then use the initialization type
  const initializer = getInitializer(declaration);
  if (initializer) {
    if (ts.isNewExpression(initializer)) {
      return nodeToString(initializer.expression) + getTypeArgumentText(initializer);
    } else {
      return nodeToString(initializer);
    }
  }
  return '';
}

function getType(declaration: ts.Declaration) {
  return (declaration as any).type as ts.TypeNode;
}

function getInitializer(declaration: ts.Declaration): ts.Expression|undefined {
  return (declaration as any).initializer;
}

function getTypeArgumentText(initializer: ts.NewExpression) {
  if (!initializer.typeArguments) {
    return '';
  }
  const typeTexts = initializer.typeArguments.map(t => nodeToString(t));
  return `<${ typeTexts.join(', ')}>`;
}
