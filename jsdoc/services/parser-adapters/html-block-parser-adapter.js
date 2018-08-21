const TAG_REGEXP = /^<([a-z-A-Z]+)\b[^>]*>/;
const VOID_TAGS = [ 'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'frame', 'hr', 'image', 'img', 'input', 'isindex', 'keygen', 'link', 'menuitem', 'meta', 'nextid', 'param', 'source', 'track', 'wbr' ];
/**
 * A ParserAdapter adapter that ignores tags between HTML blocks that would be ignored by markdown
 * See https://daringfireball.net/projects/markdown/syntax#html
 */
module.exports = function htmlBlockParserAdapter() {
  return {
    voidTags: VOID_TAGS,
    init(lines) {
      this.lines = lines;
      this.tagDepth = 0;
      this.currentTag = null;
    },
    nextLine(line, lineNumber) {
      if (this.tagDepth === 0 && this.lines[lineNumber - 1] === '') {
        const m = TAG_REGEXP.exec(line);
        if (m && this.voidTags.indexOf(m[1]) === -1) {
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
    parseForTags() {
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