import { EmitHint, Node } from 'typescript';
import { lineFeedPrinter } from './LineFeedPrinter';

/**
 * Use a preconfigured TypeScript "printer" to render the text of a node, without comments.
 */
export function nodeToString(typeNode: Node) {
  return lineFeedPrinter.printNode(EmitHint.Unspecified, typeNode, typeNode.getSourceFile());
}
