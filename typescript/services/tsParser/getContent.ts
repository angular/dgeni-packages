import { Node, SyntaxKind, ModuleDeclaration, VariableDeclaration, getTrailingCommentRanges, getLeadingCommentRanges} from 'typescript';
const LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;

export function getContent(node: Node) {

  var content = "";

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
  var sourceFile = node.getSourceFile();
  const commentRanges = getJSDocCommentRanges(node, sourceFile.text);

  if (commentRanges) {
    commentRanges.forEach(commentRange => {
      content += sourceFile.text
          .substring(commentRange.pos+ '/**'.length, commentRange.end - '*/'.length)
          .replace(LEADING_STAR, '')
          .trim();
      if (commentRange.hasTrailingNewLine) {
        content += '\n';
      }
    });
  }

  return content;
}

function getJSDocCommentRanges(node: Node, text: string) {
    var commentRanges = (node.kind === 146 /* Parameter */ ||
        node.kind === 145 /* TypeParameter */ ||
        node.kind === 186 /* FunctionExpression */ ||
        node.kind === 187 /* ArrowFunction */) ?
        concatenate(getTrailingCommentRanges(text, node.pos), getLeadingCommentRanges(text, node.pos)) :
        getLeadingCommentRanges(text, node.pos);
    // True if the comment starts with '/**' but not if it is '/**/'
    return commentRanges!.filter(comment => {
        return text.charCodeAt(comment.pos + 1) === 42 /* asterisk */ &&
            text.charCodeAt(comment.pos + 2) === 42 /* asterisk */ &&
            text.charCodeAt(comment.pos + 3) !== 47 /* slash */;
    });
}

function concatenate<T>(array1: Array<T> | undefined, array2: Array<T> | undefined) {
  return array1 ? array2 ? array1.concat(array2) : array1 : array2;
}
