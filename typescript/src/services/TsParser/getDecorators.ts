import { ArrayLiteralExpression, CallExpression, Declaration, Decorator, Expression, ObjectLiteralElement, ObjectLiteralExpression, PropertyAssignment, SyntaxKind } from 'typescript';

export type ArgumentInfo = string | string[] | { [key: string]: ArgumentInfo };

export function getDecorators(declaration: Declaration) {
  if (declaration.decorators) {
    return declaration.decorators.map(decorator => {
      const callExpression = getCallExpression(decorator);
      if (!callExpression) {
        throw new Error(`Expected decorator to be a call expression: ${decorator.getText()}`);
      }
      return {
        argumentInfo: callExpression.arguments.map(argument => parseArgument(argument)),
        arguments: callExpression.arguments.map(argument => argument.getText()),
        expression: decorator as Decorator,
        name: callExpression.expression.getText(),
      };
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
