var INLINE_TAG = /(\{@[^\s}]+[^}]*\})/;
                        //  11111111     22222222
var INLINE_TAG_DETAIL = /\{@([^\s]+)\s*([^}]*)\}/;

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
 *     handler(doc, tagName, tagDescription, docs) { ... }},
 *     description: 'Handle inline link tags',
 *     aliases: ['codeLink']
 *   };
 * }
 * ```
 */
module.exports = function inlineTagProcessor(log, createDocMessage) {
  return {
    inlineTagDefinitions: [],
    $runAfter: ['docs-rendered'],
    $runBefore: ['writing-files'],
    $process(docs) {

      const definitions = this.inlineTagDefinitions;
      const definitionMap = getMap(definitions);

      // Walk the docs and parse the inline-tags
      docs.forEach(doc => {

        if ( doc.renderedContent ) {
          // This is a stack of start-end tag instances
          // as a new start-end tag is found it is unshifted onto the front of this array
          // Each item looks like: { definition: tagDef, value: { tag: '...', content: '...' } }
          const pendingTags = [];

          // The resulting array from the split is alternating plain content and inline tags
          const parts = doc.renderedContent.split(INLINE_TAG);

          doc.renderedContent = parts.reduce((renderedContent, nextPart) => {

            const match = INLINE_TAG_DETAIL.exec(nextPart);

            if (match) {

              // We have a new tag
              const tagName = match[1];
              const tagDescription = match[2] && match[2].trim();
              if (pendingTags.length > 0 && tagName === pendingTags[0].definition.end) {

                // We have found a matching end tag. Remove it from the stack and run its handler
                const pendingTag = pendingTags.shift();
                const startTag = pendingTag.definition;

                nextPart = startTag.handler(doc, startTag.name, pendingTag.value, docs);

              } else {

                // We have a new tag. Look it up in the definitions
                const definition = definitionMap.get(tagName);

                if (!definition) {

                  // There is no matching tag definition
                  log.warn(createDocMessage('No handler provided for inline tag "' + match[0] + '"', doc));
                  nextPart = match[0];

                } else if(definition.end) {

                  // We have a new start-end tag. Unshift it onto the pendingTags stack
                  pendingTags.unshift({
                    definition: definition,
                    value: {
                      tag: tagDescription,
                      content: ''
                    }
                  });

                  nextPart = '';

                } else {

                  // We have a new normal tag. Run its handler
                  nextPart = definition.handler(doc, definition.name, tagDescription, docs);
                }
              }
            } else if (pendingTags.length) {
              // We have some plain content but we are inside a start-end tag
              // Add this content to the current start-end tag
              pendingTags[0].value.content += nextPart;
              nextPart = '';
            }

            return renderedContent + nextPart;
          });
        }

      });
    }
  };
};

function getMap(objects) {
  var map = new Map();
  objects.forEach(object => {
    map.set(object.name, object);
    if ( object.aliases ) {
      object.aliases.forEach(alias => map.set(alias, object));
    }
  });
  return map;
}

