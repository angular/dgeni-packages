var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgService getLinkInfo
 * @description
 * Get link information to a document that matches the given url
 * @kind function
 * @param  {String} url   The url to match
 * @param  {String} title An optional title to return in the link information
 * @return {Object}       The link information
 */
module.exports = function(partialNameMap, code) {

  return function getLinkInfo(url, title, currentDoc) {
    var linkInfo = {
      url: url,
      type: 'url',
      valid: true,
      title: title || url
    };

    if ( !url ) {
      throw new Error('Invalid url');
    }

    var docs = partialNameMap.getDocs(url);

    if ( docs.length > 1 && currentDoc ) {
      // If there is more than one item with this name then first
      // try to filter them by the currentDoc's area
      docs = _.filter(docs, function(doc) {
        return doc.area === currentDoc.area;
      });
    }

    if ( docs.length > 1 ) {

      linkInfo.valid = false;
      linkInfo.error = 'Ambiguous link: "' + url + '".\n' +
        docs.reduce(function(msg, doc) { return msg + '\n  "' + doc.id + '"'; }, 'Matching docs: ');

    } else if ( docs.length === 1 ) {

      linkInfo.url = docs[0].path;
      linkInfo.title = title || code(docs[0].name, true);
      linkInfo.type = 'doc';

    } else if ( url.indexOf('#') > 0 ) {
      var pathAndHash = url.split('#');
      linkInfo = getLinkInfo(pathAndHash[0], title);
      linkInfo.url = linkInfo.url + '#' + pathAndHash[1];
      return linkInfo;

    } else if ( url.indexOf('/') === -1 && url.indexOf('#') !== 0 ) {

      linkInfo.valid = false;
      linkInfo.error = 'Invalid link (does not match any doc): "' + url + '"';

    } else {

      linkInfo.title = title || (( url.indexOf('#') === 0 ) ? url.substring(1) : path.basename(url, '.html'));

    }

    return linkInfo;
  };
};