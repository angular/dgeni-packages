import { ArrayLiteralExpression, CallExpression, createPrinter, Declaration, Decorator, EmitHint, Expression, ObjectLiteralElement, ObjectLiteralExpression, PropertyAssignment, SyntaxKind } from 'typescript';

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
        const printer = createPrinter({ removeComments: true });
        return {
          argumentInfo: callExpression.arguments.map(argument => parseArgument(argument)),
          arguments: callExpression.arguments.map(argument => printer.printNode(EmitHint.Expression, argument, declaration.getSourceFile())),
          expression: decorator as Decorator,
          isCallExpression: true,
          name: callExpression.expression.getText(),
        };
      } else {
        return {
          expression: decorator as Decorator,
          isCallExpression: false,
          name: decorator.expression.getText(),
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

function parseProperties(properties: ObjectLiteralElement[]) {
  const result: ArgumentInfo = {};
  properties.forEach(property => {
    if (property.kind === SyntaxKind.PropertyAssignment) {
      result[property.name!.getText()] = parseArgument((property as PropertyAssignment).initializer);
    }
  });
  return result;
}

function parseArgument(argument: Expression): ArgumentInfo {
  if (argument.kind === SyntaxKind.ObjectLiteralExpression) {
    return parseProperties((argument as ObjectLiteralExpression).properties);
  }
  if (argument.kind === SyntaxKind.ArrayLiteralExpression) {
    return (argument as ArrayLiteralExpression).elements.map(element => element.getText());
  }
  return argument.getText();
}
