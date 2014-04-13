var log = require('winston');
var _ = require('lodash');
var extractTagsFactory = require('../lib/extract-tags');

var plugin = module.exports = {
  name: 'tag-extractor',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  description:
    'Extract the information from the tags that were parsed',
  process: function(docs, config) {

    var tagDefs = config.get('processing.tagDefinitions');
    if ( !tagDefs ) {
      throw new Error('Invalid config.\n'+
      'You must provide an array of tag definitions, at config.processing.tagDefinitions');
    }

    var extractTags = extractTagsFactory(tagDefs);

    _.forEach(docs, function(doc) {
      log.debug('extracting tags from "' + doc.file + '"" at line #' + doc.startingLine);
      extractTags(doc);
    });
  }
};



