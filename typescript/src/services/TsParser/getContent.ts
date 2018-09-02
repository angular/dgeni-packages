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
  const {leading, trailing} = getJSDocCommentRanges(node, sourceFile.text);
  const commentRanges = [];

  if (concatLeadingComments) {
    commentRanges.push(...leading);
  } else if (leading.length) {
    commentRanges.push(leading[leading.length - 1]);
  }

  if (syntaxKindsWithTrailingComments.includes(node.kind)) {
    commentRanges.push(...trailing);
  }

  commentRanges.forEach(commentRange => {
    content += sourceFile.text
        .substring(commentRange.pos + '/**'.length, commentRange.end - '*/'.length)
        .replace(LEADING_STAR, '')
        .trim();
    if (commentRange.hasTrailingNewLine) {
      content += '\n';
    }
  });

  return content.trim();
}

function getJSDocCommentRanges(node: Node, text: string) {
  const leading = (getLeadingCommentRanges(text, node.pos) || [])
    .filter(range => isJSDocCommentRange(text, range));

  const trailing = (getTrailingCommentRanges(text, node.pos) || [])
    .filter(range => isJSDocCommentRange(text, range));

  return {leading, trailing};
}

/** Whether the specified comment range refers to a JSDoc comment. */
function isJSDocCommentRange(text: string, range: CommentRange): boolean {
  // Multi line comments are not always JSDoc comments. e.g. /* abc */ or /**/.
  return range.kind === SyntaxKind.MultiLineCommentTrivia &&
    text.charCodeAt(range.pos + 1) === ASTERISK &&
    text.charCodeAt(range.pos + 2) === ASTERISK &&
    text.charCodeAt(range.pos + 3) !== SLASH;
}
