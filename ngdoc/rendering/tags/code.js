var trimIndentation = require('dgeni/lib/utils/trim-indentation');
var code = require('dgeni/lib/utils/code');

module.exports = {
  tags: ['code'],

  parse: function(parser, nodes) {
    var tok = parser.nextToken();
    var args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    var content = parser.parseUntilBlocks("endcode");
    var tag = new nodes.CallExtension(this, 'process', args, [content]);
    parser.advanceAfterBlockEnd();

    return tag;
  },

  process: function(context, lang, content) {
    if ( !content ) {
      content = lang;
      lang = undefined;
    }
    var trimmedString = trimIndentation(content());
    var codeString = code(trimmedString, false, lang);
    return codeString;
  }
};