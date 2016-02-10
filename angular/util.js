'use strict';

// Nicely stolen from extractJSDocCommentsProcessor
var LEADING_STAR = /^[^\S\r\n]*\*[^\S\n\r]?/gm;


module.exports = {
  getMatchingJSDoc: getMatchingJSDoc,
  resolveIdentifier: resolveIdentifier
};


function getMatchingJSDoc(comments) {
  if (!comments) {
    return null;
  }
  for (var i = comments.length; i > 0; i--) {
    var comment = comments[i - 1];
    if (comment && comment.type === 'Block' && comment.value.charAt(0) === '*') {
      return comment.value.replace(LEADING_STAR, '').trim();
    }
  }
}


function resolveIdentifier(node) {
  if (node.type !== 'Identifier') {
    return node;
  }
  console.log(node);
}
