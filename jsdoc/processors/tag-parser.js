var _ = require('lodash');
var log = require('winston');
var tagParserFactory = require('../lib/tagParser');
var defaultTagProcessors = require('../lib/tagProcessors');

function formatBadTagErrorMessage(doc) {
  var id = (doc.id || doc.name);
  id = id ? '"' + id + '" ' : '';
  var message = 'Invalid tags found in doc, starting at line ' + doc.startingLine + ', from file "' + doc.file + '"\n';

  _.forEach(doc.tags.badTags, function(badTag) {
    //console.log(badTag);
    var description = (_.isString(badTag.description) && (badTag.description.substr(0, 20) + '...'));
    if ( badTag.name ) {
      description = badTag.name + ' ' + description;
    }
    if ( badTag.typeExpression ) {
      description = '{' + badTag.typeExpression + '} ' + description;
    }

    message += 'Line: ' + badTag.startingLine + ': @' + badTag.tagName + ' ' + description + '\n';
    _.forEach(badTag.errors, function(error) {
      message += '    * ' + error + '\n';
    });
  });

  return message + '\n';
}

var plugin = module.exports = {
  name: 'tag-parser',
  description: 'Parse the doc for tags',
  runAfter: ['parsing-tags'],
  runBefore: ['tags-parsed'],
  process: function(docs, config) {

    var tagDefinitions = config.get('processing.tagDefinitions');
    var tagProcessors = config.get('processing.tagProcessors', defaultTagProcessors);
    var parseTags = tagParserFactory(tagDefinitions, tagProcessors);

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