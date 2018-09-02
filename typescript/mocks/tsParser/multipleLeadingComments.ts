/**
 * Not a license comment.
 */

/**
 * This is a test function
 */
export function test(a: string) {
  return a;
}

export function withNoComment(b: string) {
  return b;
}

/** This is the real comment. */
// This is a comment that shouldn't be documented.
export function withLeadingSingleLineComment(c: string) {
  return c;
}

/** This JSDoc comment should be ignored. */
/** First real comment. */
// Non js single line document
/* Non JS-doc document. */
export function withLeadingNonJsDocComment(c: string) {
  return c;
}
