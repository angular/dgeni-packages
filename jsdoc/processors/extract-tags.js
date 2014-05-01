var log = require('winston');
var _ = require('lodash');

/**
 * dgProcessor extract-tags
 * @description
 * Extract the information from the tags that were parsed
 */
var plugin = module.exports = {
  name: 'extract-tags',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  process: function(docs, tagExtractor) {
    _.forEach(docs, function(doc) {
      log.debug('extracting tags from "' + doc.file + '"" at line #' + doc.startingLine);
      tagExtractor(doc);
    });
  }
};



