var _ = require('lodash');
require('es6-shim');
var INLINE_TAG = /\{@([^\s]+)\s+([^\}]*)\}/g;

/**
 * @dgProcessor inlineTagProcessor
 * @description
 * Search the docs for inline tags that need to have content injected.
 *
 * Inline tags are defined by a collection of inline tag definitions.  Each definition is an injectable function,
 * which should create an object containing, as minimum, a `name` property and a `handler` method, but also,
 * optionally, `description` and `aliases` properties.
 *
 * * The `name` should be the canonical tag name that should be handled.
 * * The `aliases` should be an array of additional tag names that should be handled.
 * * The `handler` should be a method of the form: `function(doc, tagName, tagDescription, docs) { ... }`
 * The
 * For example:
 *
 * ```
 * function(partialNames) {
 *   return {
 *     name: 'link',
 *     handler: function(doc, tagName, tagDescription, docs) { ... }},
 *     description: 'Handle inline link tags',
 *     aliases: ['codeLink']
 *   };
 * }
 * ```
 */
module.exports = function inlineTagProcessor(log) {
  return {
    inlineTagDefinitions: [],
    $runAfter: ['docs-rendered'],
    $runBefore: ['writing-files'],
    $process: function(docs) {

      var definitions = this.inlineTagDefinitions;
      var definitionMap = getMap(definitions);

      // Walk the docs and parse the inline-tags
      _.forEach(docs, function(doc) {

        if ( doc.renderedContent ) {

          // Replace any inline tags found in the rendered content
          doc.renderedContent = doc.renderedContent.replace(INLINE_TAG, function(match, tagName, tagDescription) {

            var definition = definitionMap.get(tagName);
            if ( definition ) {

              try {

                // It is easier to trim the description here than to fiddle around with the INLINE_TAG regex
                tagDescription = tagDescription && tagDescription.trim();

                // Call the handler with the parameters that its factory would not have been able to get from the injector
                return definition.handler(doc, tagName, tagDescription, docs);

              } catch(e) {
                throw new Error('There was a problem running the @' + tagName +
                            ' inline tag handler for ' + match + '\n' +
                            'Doc: ' + doc.id + '\n' +
                            'File: ' + doc.fileInfo.filePath + '\n' +
                            'Line: ' + doc.startingLine + '\n' +
                            'Message: \n' + e.message);
              }

            } else {
              log.warn('No handler provided for inline tag "' + match + '" for "' + doc.id + '"' +
                        '" in file "' + doc.fileInfo.filePath + '" at line ' + doc.startingLine);
              return match;
            }

          });
        }
      });
    }
  };
};

function getMap(objects) {
  var map = new Map();
  objects.forEach(function(object) {
    map.set(object.name, object);
    if ( object.aliases ) {
      object.aliases.forEach(function(alias) {
        map.set(alias, object);
      });
    }
  });
  return map;
}

