import { createPrinter, EmitHint, NewLineKind, TypeNode } from 'typescript';
import { nodeToString } from './nodeToString';

const printerOptions = {removeComments: true, newLine: NewLineKind.LineFeed};
const printer = createPrinter(printerOptions);

export function getTypeText(type: TypeNode): string {
  return printer.printNode(EmitHint.Unspecified, type, type.getSourceFile());
}