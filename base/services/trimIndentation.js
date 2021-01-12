 const isEmpty = RegExp.prototype.test.bind(/^\s*$/);

function calcIndent(text) {
  const MAX_INDENT = 9999;
  const lines = text.split('\n');
  let minIndent = MAX_INDENT;
  let emptyLinesRemoved = false;

  // ignore leading empty lines
  while(isEmpty(lines[0])) {
    lines.shift();
    emptyLinesRemoved = true;
  }

  if(lines.length) {

    // ignore first line if it has no indentation and there is more than one line
    // this is because sometimes our text starts in the middle of a line of other
    // text that is indented and so doesn't appear to have an indent when it really does.
    const ignoreLine = (lines[0][0] != ' '  && lines.length > 1);
    if ( ignoreLine && !emptyLinesRemoved ) {
      lines.shift();
    }

    lines.forEach(line => {
      if ( !isEmpty(line) ) {
        const indent = line.match(/^\s*/)[0].length;
        minIndent = Math.min(minIndent, indent);
      }
    });

  }

  return minIndent;
}

function reindent(text, indent) {
  const lines = text.split('\n');
  const indentedLines = [];
  const indentStr = new Array(indent + 1).join(' ');
  lines.forEach(line => indentedLines.push(indentStr + line));
  return indentedLines.join('\n');
}

function trimIndent(text, indent) {
  const lines = text.split('\n');
  const indentRegExp = new RegExp('^\\s{0,' + indent + '}');

  // remove the indentation
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(indentRegExp, '');
  }

  // remove leading lines
  while (isEmpty(lines[0])) { lines.shift(); }

  // remove trailing
  while (isEmpty(lines[lines.length - 1])) { lines.pop(); }

  return lines.join('\n');
}

// The primary export is a function that does the intentation trimming
module.exports = function trimIndentation() {
  const trimIndentationImpl = text => trimIndent(text, calcIndent(text));
  trimIndentationImpl.calcIndent = calcIndent;
  trimIndentationImpl.trimIndent = trimIndent;
  trimIndentationImpl.reindent = reindent;
  return trimIndentationImpl;
};
