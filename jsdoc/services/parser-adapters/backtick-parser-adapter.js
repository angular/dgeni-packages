/**
 * A ParserAdapter adapter that ignores tags between triple backtick blocks
 */
module.exports = function backTickParserAdapter() {
  return {
    init() {
      this.inCode = false;
    },
    nextLine(line, lineNumber) {
      const CODE_FENCE = /^\s*```(?!.*```)/;
      if ( CODE_FENCE.test(line) ) {
        this.inCode = !this.inCode;
      }
    },
    parseForTags() {
      return !this.inCode;
    }
  };
};
