var _ = require('lodash');
var log = require('winston');
var INLINE_LINK = /(\S+)(?:\s+(.+))?/;

module.exports = {
  name: 'link',
  description: 'Process inline link tags (of the form {@link some/uri Some Title}), replacing them with HTML anchors',
  handlerFactory: function(partialNames) {

    return function handleLinkTags(doc, tagName, tagDescription) {

      // Parse out the uri and title
      return tagDescription.replace(INLINE_LINK, function(match, uri, title) {

        var linkInfo = partialNames.getLink(uri, title);

        if ( !linkInfo.valid ) {
          log.warn('Error processing link "' + uri + '" for "' + doc.id + '" in file "' + doc.file + '" at line ' + doc.startingLine + ':\n' + linkInfo.error);
          linkInfo = {
            url: uri,
            title: title || uri
          };
        }
        
        return _.template('<a href="${url}">${title}</a>', linkInfo);
      });
    };
  }
};