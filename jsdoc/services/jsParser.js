var jsParserImpl = require('espree');

module.exports = function jsParser(jsParserConfig) {
  return code => jsParserImpl.parse(code, jsParserConfig);
};
