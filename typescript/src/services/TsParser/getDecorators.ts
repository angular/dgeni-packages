import {
    ArrayLiteralExpression,
    CallExpression,
    Declaration,
    Decorator,
    EmitHint,
    Expression,
    NodeArray,
    ObjectLiteralElement,
    ObjectLiteralElementLike,
    ObjectLiteralExpression,
    PropertyAssignment,
    SyntaxKind
} from 'typescript';
import { lineFeedPrinter } from './LineFeedPrinter';
import { nodeToString } from './nodeToString';

export type ArgumentInfo = string | string[] | { [key: string]: ArgumentInfo };

export interface ParsedDecorator {
  argumentInfo?: ArgumentInfo[];
  arguments?: string[];
  expression: Decorator;
  isCallExpression: boolean;
  name: string;
}

export function getDecorators(declaration: Declaration) {
  if (declaration.decorators) {
    return declaration.decorators.map<ParsedDecorator>(decorator => {
      const callExpression = getCallExpression(decorator);
      if (callExpression) {
        return {
          argumentInfo: callExpression.arguments.map(argument => parseArgument(argument)),
          arguments: callExpression.arguments.map(argument =>
              lineFeedPrinter.printNode(EmitHint.Expression, argument, declaration.getSourceFile())),
          expression: decorator as Decorator,
          isCallExpression: true,
          name: nodeToString(callExpression.expression),
        };
      } else {
        return {
          expression: decorator as Decorator,
          isCallExpression: false,
          name: nodeToString(decorator.expression),
        };
      }
    });
  }
}

function getCallExpression(decorator: Decorator) {
  if (decorator.expression.kind === SyntaxKind.CallExpression) {
    return (decorator.expression as CallExpression);
  }
}

function parseProperties(properties: NodeArray<ObjectLiteralElementLike>) {
  const result: ArgumentInfo = {};
  properties.forEach(property => {
    if (property.kind === SyntaxKind.PropertyAssignment) {
      result[nodeToString(property.name!)] = parseArgument((property as PropertyAssignment).initializer);
    }
  });
  return result;
}

function parseArgument(argument: Expression): ArgumentInfo {
  if (argument.kind === SyntaxKind.ObjectLiteralExpression) {
    return parseProperties((argument as ObjectLiteralExpression).properties);
  }
  if (argument.kind === SyntaxKind.ArrayLiteralExpression) {
    return (argument as ArrayLiteralExpression).elements.map(element => nodeToString(element));
  }
  return nodeToString(argument);
}
