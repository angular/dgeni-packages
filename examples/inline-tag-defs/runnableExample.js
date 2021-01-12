/**
 * @dgService runnableExampleInlineTagDef
 * @description
 * Inject the specified runnable example into the doc
 */
module.exports = function runnableExampleInlineTagDef(exampleMap, createDocMessage) {
  return {
    name: 'runnableExample',

    handler(doc, tagName, description) {

      // The tag description should contain the id of the runnable example doc
      const example = exampleMap.get(description);
      if ( !example ) {
        throw new Error(createDocMessage('No example exists with id "' + description + '".', doc));
      }
      if ( !example.runnableExampleDoc ) {
        throw new Error(createDocMessage('Example "' + description + '" does not have an associated runnableExampleDoc. Are you missing a processor (examples-generate)?"', doc));
      }

      return example.runnableExampleDoc.renderedContent;
    }
  };
};