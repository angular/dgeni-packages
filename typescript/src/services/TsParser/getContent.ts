import { getLeadingCommentRanges, getTrailingCommentRanges, ModuleDeclaration, Node, SyntaxKind, VariableDeclaration } from 'typescript';
const LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;
const ASTERISK = 42;
const SLASH = 47;

export function getContent(node: Node|undefined) {

  let content = '';

  if (!node) return content;

  if (node.kind === SyntaxKind.ModuleDeclaration) {
    let moduleDeclaration = node as ModuleDeclaration;
    // If this is left side of dotted module declaration, there is no doc comment associated with this declaration
    if (moduleDeclaration.body && moduleDeclaration.body.kind === SyntaxKind.ModuleDeclaration) {
      return content;
    }

    // If this is dotted module name, get the doc comments from the parent
    while (moduleDeclaration.parent && moduleDeclaration.parent.kind === SyntaxKind.ModuleDeclaration) {
      moduleDeclaration = moduleDeclaration.parent;
    }
    node = moduleDeclaration;
  }

  // If this is a variable declaration then we get the doc comments from the grand parent
  if (node.kind === SyntaxKind.VariableDeclaration) {
    node = node.parent && node.parent.parent || node;
  }

  // Get the source file of this node
  const sourceFile = node.getSourceFile();
  const commentRanges = getJSDocCommentRanges(node, sourceFile.text);

  if (commentRanges) {
    commentRanges.forEach(commentRange => {
      content += sourceFile.text
          .substring(commentRange.pos + '/**'.length, commentRange.end - '*/'.length)
          .replace(LEADING_STAR, '')
          .trim();
      if (commentRange.hasTrailingNewLine) {
        content += '\n';
      }
    });
  }

  return content.trim();
}

function getJSDocCommentRanges(node: Node, text: string) {
    const commentRanges = (
        node.kind === SyntaxKind.Parameter ||
        node.kind === SyntaxKind.TypeParameter ||
        node.kind === SyntaxKind.FunctionExpression ||
        node.kind === SyntaxKind.ArrowFunction
      ) ?
      concatenate(getTrailingCommentRanges(text, node.pos), getLeadingCommentRanges(text, node.pos)) :
      getLeadingCommentRanges(text, node.pos);

    // True if the comment starts with '/**' but not if it is '/**/'
    if (commentRanges) {
      return commentRanges.filter(comment =>
        text.charCodeAt(comment.pos + 1) === ASTERISK &&
        text.charCodeAt(comment.pos + 2) === ASTERISK &&
        text.charCodeAt(comment.pos + 3) !== SLASH);
    }
}

function concatenate<T>(array1: T[] | undefined, array2: T[] | undefined) {
  return array1 ? array2 ? array1.concat(array2) : array1 : array2;
}
