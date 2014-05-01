var _ = require('lodash');
var log = require('winston');

/**
 * @dgProcessor parse-tags
 * @description Parse the doc for tags
 */
var plugin = module.exports = {
  name: 'parse-tags',
  runAfter: ['parsing-tags'],
  runBefore: ['tags-parsed'],
  process: function(docs, tagParser) {

    _.forEach(docs, function(doc) {
      try {
        doc.tags = tagParser(doc.content, doc.startingLine);
      } catch(e) {
        log.error('Error parsing tags for doc starting at ' + doc.startingLine + ' in file ' + doc.file);
        throw e;
      }
    });
  }
};