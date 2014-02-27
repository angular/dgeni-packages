var _ = require('lodash');
var log = require('winston');
var tagParserFactory = require('../lib/tagParser');
var tagProcessors = require('../lib/tagProcessors');

function formatBadTagErrorMessage(doc) {
  var message = 'Bad tags found in doc "' + doc.id + '" from file "' + doc.file + '" line ' + doc.startingLine + '\n';

  _.forEach(doc.tags.badTags, function(badTag) {
    var title = badTag.title || '<missing>';
    var description =
      badTag.name ||
      (_.isString(badTag.description) ? (badTag.description.substr(0, 20) + '...') : '<missing>');

    message += '  - Bad tag: "' + title + '" - "' + description + '"\n';
    _.forEach(badTag.errors, function(error) {
      message += '    * ' + error + '\n';
    });
  });

  return message + '\n';
}

var parseTags;

var plugin = module.exports = {
  name: 'tag-parser',
  description: 'Parse the doc for tags',
  runAfter: ['parsing-tags'],
  runBefore: ['tags-parsed'],
  init: function(config) {
    var tagDefinitions = config.get('processing.tagDefinitions');
    tagProcessors = config.get('processing.tagProcessors', tagProcessors);
    parseTags = tagParserFactory(tagDefinitions, tagProcessors);
  },
  process: function(docs) {
    _.forEach(docs, function(doc) {
      try {
        var tags = parseTags(doc.content, doc.startingLine);
        doc.tags = tags;
        if ( tags.badTags.length > 0 ) {
          log.warn(formatBadTagErrorMessage(doc));
        }
      } catch(e) {
        log.error('Error parsing tags for doc starting at ' + doc.startingLine + ' in file ' + doc.file);
        throw e;
      }
    });
  }
};