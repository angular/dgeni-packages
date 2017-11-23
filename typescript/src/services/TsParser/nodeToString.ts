import { createPrinter, EmitHint, Node } from 'typescript';

const printer = createPrinter({ removeComments: true });

/**
 * Use a preconfigured TypeScript "printer" to render the text of a node, without comments.
 */
export function nodeToString(typeNode: Node) {
  return printer.printNode(EmitHint.Unspecified, typeNode, typeNode.getSourceFile());
}
