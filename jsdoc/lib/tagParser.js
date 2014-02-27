var _ = require('lodash');
var TagCollection = require('./TagCollection');
var Tag = require('./Tag');

var END_OF_LINE = /\r?\n/;
var TAG_MARKER = /^\s*@(\S+)\s*(.*)$/;


/**
 * Create a new tagParser that can parse a set of jsdoc-style tags from a document
 * @param  {Array} tagDefinitions A collection of tag definitions.  Each definitions specifies what
 *                                to parse from the doc
 * @return {TagCollection}               A collection of tags that were extracted from the document
 */
module.exports = function tagParserFactory(tagDefinitions, tagProcessors) {

  // Create a map of the tagDefinitions so that we can look up tagDefs based on name or alias
  var tagDefMap = Object.create(null);
  _.forEach(tagDefinitions, function(tagDefinition) {
    tagDefMap[tagDefinition.name] = tagDefinition;
    _.forEach(tagDefinition.aliases, function(alias) {
      tagDefMap[alias] = tagDefinition;
    });
  });

  return function tagParser(content, startingLine) {
    var lines = content.split(END_OF_LINE);
    var lineNumber = 0;
    var line, match;
    var descriptionLines = [];
    var current;          // The current that that is being extracted
    var tags = new TagCollection();        // Contains all the tags that have been found

    // Extract the description block
    do {
      line = lines[lineNumber];
      match = TAG_MARKER.exec(line);
      if ( match && tagDefMap[match[1]] ) {
        current = new Tag(tagDefMap[match[1]], match[1], match[2], startingLine + lineNumber);
        break;
      }
      lineNumber += 1;
      descriptionLines.push(line);
    } while(lineNumber < lines.length);
    tags.description = descriptionLines.join('\n');

    lineNumber += 1;

    // Extract the tags
    while(lineNumber < lines.length) {
      line = lines[lineNumber];
      match = TAG_MARKER.exec(line);
      if ( match && tagDefMap[match[1]] ) {
        tags.addTag(current);
        current = new Tag(tagDefMap[match[1]], match[1], match[2], startingLine + lineNumber);
      } else {
        current.description = current.description ? (current.description + '\n' + line) : line;
      }
      lineNumber += 1;
    }
    if ( current ) {
      tags.addTag(current);
    }

    _.forEach(tagProcessors, function(tagProcessor) {
      tagProcessor(tags);
    });

    return tags;
  };
};