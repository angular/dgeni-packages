module.exports = function(trimIndentation, encodeCodeBlock) {
  return {
    tags: ['code'],

    parse(parser, nodes) {
      const tok = parser.nextToken();
      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);

      const content = parser.parseUntilBlocks("endcode");
      const tag = new nodes.CallExtension(this, 'process', args, [content]);
      parser.advanceAfterBlockEnd();

      return tag;
    },

    process(context, lang, content) {
      if ( !content ) {
        content = lang;
        lang = undefined;
      }
      const trimmedString = trimIndentation(content());
      const codeString = encodeCodeBlock(trimmedString, false, lang);
      return codeString;
    }
  };
};