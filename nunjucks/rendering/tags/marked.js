/**
 * @dgRenderTag marked
 * @description Convert a block of template text from markdown to HTML
 */
module.exports = function markedNunjucksTag(trimIndentation, renderMarkdown) {
  return {
    tags: ['marked'],

    /** Disable autoescape for this tag because the markdown tag renders HTML that shouldn't be escaped. */
    autoescape: false,

    parse(parser, nodes) {
      parser.advanceAfterBlockEnd();

      const content = parser.parseUntilBlocks("endmarked");
      const tag = new nodes.CallExtension(this, 'process', null, [content]);
      parser.advanceAfterBlockEnd();

      return tag;
    },

    process(context, content) {
      const contentString = content();
      const indent = trimIndentation.calcIndent(contentString);
      const trimmedString = trimIndentation.trimIndent(contentString, indent);
      const markedString = renderMarkdown(trimmedString);

      return trimIndentation.reindent(markedString, indent);
    }
  };
};
