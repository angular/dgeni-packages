import {
  CommentRange,
  getLeadingCommentRanges,
  getTrailingCommentRanges,
  ModuleDeclaration,
  Node,
  SyntaxKind,
} from 'typescript';

const LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;
const ASTERISK = 42;
const SLASH = 47;

const syntaxKindsWithTrailingComments = [
  SyntaxKind.Parameter,
  SyntaxKind.TypeParameter,
  SyntaxKind.FunctionExpression,
  SyntaxKind.ArrowFunction,
];

export function getContent(node: Node | undefined, concatLeadingComments = true) {

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
  const commentRanges = getJSDocCommentRanges(node, sourceFile.text, concatLeadingComments);

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

function getJSDocCommentRanges(node: Node, text: string, concatLeadingComments: boolean) {
    const commentRanges: CommentRange[] = [];
    const leadingCommentRanges = getLeadingCommentRanges(text, node.pos) || [];
    const trailingCommentRanges = getTrailingCommentRanges(text, node.pos) || [];

    if (syntaxKindsWithTrailingComments.includes(node.kind)) {
      commentRanges.push(...trailingCommentRanges);
    }

    if (concatLeadingComments) {
      commentRanges.push(...leadingCommentRanges);
    } else if (leadingCommentRanges.length) {
      commentRanges.push(leadingCommentRanges[leadingCommentRanges.length - 1]);
    }

    // True if the comment starts with '/**' but not if it is '/**/'
    if (commentRanges) {
      return commentRanges.filter(comment =>
        text.charCodeAt(comment.pos + 1) === ASTERISK &&
        text.charCodeAt(comment.pos + 2) === ASTERISK &&
        text.charCodeAt(comment.pos + 3) !== SLASH);
    }
}
