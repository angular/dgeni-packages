import { ClassDeclaration, InterfaceDeclaration, SyntaxKind } from 'typescript';
import { nodeToString } from './nodeToString';

export function getHeritageClause(declaration: ClassDeclaration | InterfaceDeclaration) {
  let heritageString = '';
  if (declaration.heritageClauses) {
    declaration.heritageClauses.forEach(heritage => {
      if (heritage.token === SyntaxKind.ExtendsKeyword) heritageString += ' extends';
      if (heritage.token === SyntaxKind.ImplementsKeyword) heritageString += ' implements';
      heritageString += heritage.types.map(typ => ' ' + nodeToString(typ)).join(',');
    });
  }
  return heritageString;
}
