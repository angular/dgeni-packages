var trimIndentation = require('dgeni/lib/utils/trim-indentation');
var code = require('dgeni/lib/utils/code');

module.exports = {
  tags: ['code'],

  parse: function(parser, nodes) {
    parser.advanceAfterBlockEnd();

    var content = parser.parseUntilBlocks("endcode");
    var tag = new nodes.CallExtension(this, 'process', null, [content]);
    parser.advanceAfterBlockEnd();

    return tag;
  },

  process: function(context, content) {
    var trimmedString = trimIndentation(content());
    var codeString = code(trimmedString);
    return codeString;
  }
};