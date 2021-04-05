const TagCollection = require('../lib/TagCollection');
const Tag = require('../lib/Tag');

/**
 * @dgProcessor parseTagsProcessor
 * @description Parse the doc for jsdoc style tags
 */
module.exports = function parseTagsProcessor(log, createDocMessage, backTickParserAdapter, htmlBlockParserAdapter) {
  return {
    tagDefinitions: [],
    parserAdapters: [backTickParserAdapter, htmlBlockParserAdapter],
    $validate: {
      tagDefinitions: { presence: true },
    },
    $runAfter: ['parsing-tags'],
    $runBefore: ['tags-parsed'],
    $process(docs) {

      const tagParser = createTagParser(this.tagDefinitions, this.parserAdapters);

      docs.forEach(doc => {
        try {
          doc.tags = tagParser(doc.content || '', doc.startingLine);
        } catch(e) {
          const message = createDocMessage('Error parsing tags', doc, e);
          log.error(message);
          throw new Error(message);
        }
      });
    }
  };
};

/**
 * Create a map of the tagDefinitions keyed on their name or alias
 * @param  {Array} tagDefinitions  A collection of tag definitions to map
 * @return {Map}                [description]
 */
function createTagDefMap(tagDefinitions) {
  // Create a map of the tagDefinitions so that we can look up tagDefs based on name or alias
  const map = new Map();
  tagDefinitions.forEach(tagDefinition => {
    map.set(tagDefinition.name, tagDefinition);
    if ( tagDefinition.aliases ) {
      tagDefinition.aliases.forEach(alias => map.set(alias, tagDefinition));
    }
  });
  return map;
}

/**
 * Create a new tagParser that can parse a set of jsdoc-style tags from a document
 * @param  {Array} tagDefMap A map of tag definitions keyed on tagName/aliasName.
 * @param {ParserAdapter[]} A collection of adapters that modify the parsing behaviour
 */
function createTagParser(tagDefinitions, parserAdapters) {

  const END_OF_LINE = /\r?\n/;
  const TAG_MARKER = /^\s*@(\S+)\s*(.*)$/;
  const tagDefMap = createTagDefMap(tagDefinitions);

  /**
   * tagParser
   * @param  {string} content      The text to parse for tags
   * @param  {number} startingLine The line in the doc file where this text begins
   * @return {TagCollection}       A collection of tags that were parsed
   */
  return function tagParser(content, startingLine) {
    const lines = content.split(END_OF_LINE);
    let lineNumber = 0;
    const descriptionLines = [];
    let current;                             // The current that that is being extracted
    const tags = new TagCollection();        // Contains all the tags that have been found

    init(lines, tags);

    // Extract the description block
    do {
      let line = lines[lineNumber];

      nextLine(line, lineNumber);

      if (parseForTags()) {
        const match = TAG_MARKER.exec(line);
        const tagDef = match && tagDefMap.get(match[1]);
        if ( match && ( !tagDef || !tagDef.ignore ) ) {
          // Only store tags that are unknown or not ignored
          current = new Tag(tagDef, match[1], match[2], startingLine + lineNumber);
          break;
        }
      }

      lineNumber += 1;
      descriptionLines.push(line);

    } while(lineNumber < lines.length);
    tags.description = descriptionLines.join('\n');

    lineNumber += 1;

    // Extract the tags
    while(lineNumber < lines.length) {
      const line = lines[lineNumber];

      nextLine(line, lineNumber);

      const match = TAG_MARKER.exec(line);
      const tagDef = match && tagDefMap.get(match[1]);
      if (parseForTags() && match && (!tagDef || !tagDef.ignore) ) {
        tags.addTag(current);
        current = new Tag(tagDef, match[1], match[2], startingLine + lineNumber);
      } else {
        current.description = current.description ? (current.description + '\n' + line) : line;
      }

      lineNumber += 1;
    }
    if ( current ) {
      tags.addTag(current);
    }

    return tags;
  };


  function init(lines, tags) {
    parserAdapters.forEach(adapter => adapter.init(lines, tags));
  }

  function nextLine(line, lineNumber) {
    parserAdapters.forEach(adapter => adapter.nextLine(line, lineNumber));
  }

  function parseForTags() {
    return parserAdapters.every(adapter => adapter.parseForTags());
  }
}
