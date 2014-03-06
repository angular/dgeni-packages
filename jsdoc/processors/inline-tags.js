var _ = require('lodash');
var log = require('winston');
var INLINE_TAG = /\{@([^\s]+)\s+([^\}]*)\}/g;

var inlineTagDefinitions;

// We add InlineTagHandler onto the end of the tag name to help prevent naming collisions
// in the injector
function handlerId(name) {
  return name + 'InlineTagHandler';
}

module.exports = {
  name: 'inline-tags',
  description: 'Search the docs for inline tags that need to have content injected',
  runAfter: ['docs-rendered'],
  runBefore: ['writing-files'],
  init: function(config) {

    // A collection of inline tag definitions.  Each should have, as minimum `name` and `handlerFactory`
    // properties, but also optionally a definition and aliases tags
    // e.g.
    // {
    //   name: 'link',
    //   handlerFactory: function(docs, partialNames) { return function handler(doc, tagName, tagDescription) { ... }},
    //   description: 'Handle inline link tags',
    //   aliases: ['codeLink']
    // }
    inlineTagDefinitions = config.get('processing.inlineTagDefinitions', []);
  },
  process: function(docs, injector) {

    var handlerFactories = {};

    _.forEach(inlineTagDefinitions, function(definition, index) {
      if ( !definition.name ) {
        throw new Error('Invalid configuration: inlineTagDefinition at position ' + index + ' is missing a name property');
      }
      if ( !definition.handlerFactory ) {
        throw new Error('Invalid configuration: inlineTagDefinition ' + definition.name + ' missing handlerFactory');
      }
      
      // Add the 
      handlerFactories[handlerId(definition.name)] = ['factory', definition.handlerFactory];
      
      _.forEach(definition.aliases, function(alias) {
        handlerFactories[handlerId(alias)] = ['factory', definition.handlerFactory];
      });
    });

    injector = injector.createChild([handlerFactories]);

      // Walk the docs and parse the inline-tags
    _.forEach(docs, function(doc) {

      if ( doc.renderedContent ) {
        
        // Replace any inline tags found in the rendered content
        doc.renderedContent = doc.renderedContent.replace(INLINE_TAG, function(match, tagName, tagDescription) {

          if ( handlerFactories[handlerId(tagName)] ) {
            
            // Get the handler for this tag from the injector
            var handler = injector.get(handlerId(tagName));

            try {

              // It is easier to trim the description here than to fiddle around with the INLINE_TAG regex
              tagDescription = tagDescription && tagDescription.trim();

              // Call the handler with the parameters that its factory would not have been able to get
              // from the injector
              return handler(doc, tagName, tagDescription);

            } catch(e) {
              throw new Error('There was a problem running the @' + tagName +
                          ' inline tag handler for ' + match + '\n' +
                          'Doc: ' + doc.id + '\n' +
                          'File: ' + doc.file + '\n' +
                          'Line: ' + doc.startingLine + '\n' +
                          'Message: \n' + e.message);
            }
          
          } else {
            log.warn('No handler provided for inline tag "' + match + '" for "' + doc.id + '" in file "' + doc.file + '" at line ' + doc.startingLine);
            return match;
          }

        });
      }
    });
  }
};