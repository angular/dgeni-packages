var log = require('winston');
var _ = require('lodash');
var extractTagsFactory = require('../lib/extract-tags');

var extractTags;
var plugin = module.exports = {
  name: 'tag-extractor',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  description:
    'Extract the information from the tags that were parsed',
  init: function initialize(config) {
    if ( !config || !config.processing || !config.processing.tagDefinitions ) {
      throw new Error('Invalid config.\n'+
      'You must provide an array of tag definitions, at config.processing.tagDefinitions');
    }
    extractTags = extractTagsFactory(config.processing.tagDefinitions);
  },
  process: function(docs) {
    _.forEach(docs, function(doc) {
      log.debug('extracting tags from "' + doc.file + '"" at line #' + doc.startingLine);
      extractTags(doc);
    });
  }
};



