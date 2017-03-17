const TAG_REGEXP = /^<([a-zA-Z]+)\b[\s\S]*?>/;
/**
 * A ParserAdapter adapter that ignores tags between HTML blocks that would be ignored by markdown
 * See https://daringfireball.net/projects/markdown/syntax#html
 */
module.exports = function htmlBlockParserAdapter() {
  return {
    init: function(lines) {
      this.lines = lines;
      this.tagDepth = 0;
      this.currentTag = null;
    },
    nextLine: function(line, lineNumber) {
      if (this.tagDepth === 0 && this.lines[lineNumber - 1] === '') {
        const m = TAG_REGEXP.exec(line);
        if (m) {
          this.currentTag = m[1];
        }
      }
      if (this.currentTag) {
        this.tagDepth = this.tagDepth + countTags(line, '<' + this.currentTag) - countTags(line, '</' + this.currentTag);
      }
      if (this.tagDepth === 0) {
        this.currentTag = null;
      }
    },
    parseForTags: function() {
      return !this.currentTag;
    }
  };
};


function countTags(line, marker) {
  const regexp = new RegExp(marker + '\\b[\\s\\S]*?(/)?>', 'g');
  let count = 0;
  let match;
  while(match = regexp.exec(line)) {
    count += 1;
  }
  return count;
}