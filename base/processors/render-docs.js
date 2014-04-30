var _ = require('lodash');
var log = require('winston');

/**
 * @dgProcessor render-doc
 * @description
 * Render the set of documents using the provided `templateEngine`, to the output folder,
 * using the extra data and the templates found by `templateFinder`.
 * @param  {object} docs             The documents to render
 * @param {Config} config            The Dgeni configuration object
 * @param {object} extraData         All the injectable components in the base injector
 * @param {object} templateFinder    A helper that can match docs to templates
 * @param {object} templateEngine    The engine that will render the docs/templates
 */
var plugin = module.exports = {
  name: 'render-docs',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],

  process: function render(docs, config, extraData, templateFinder, templateEngine) {

    // Extract any extra helper functions/data from the config
    var helpers = _.defaults(Object.create(null), config.rendering.helpers);


    _.forEach(docs, function(doc) {
      log.debug('Rendering doc', doc.id, doc.name);
      try {
        var data = _.defaults(Object.create(null), { doc: doc, docs: docs }, extraData, helpers);
        var templateFile = templateFinder(data.doc);
        doc.renderedContent = templateEngine.render(templateFile, data);
      } catch(ex) {
        console.log(_.omit(doc, ['content', 'moduleDoc', 'components', 'serviceDoc', 'providerDoc']));
        throw new Error('Failed to render doc "' + doc.id + '" from file "' + doc.file + '" line ' + doc.startingLine + '\n Error Message follows:\n' + ex.stack);
      }
    });

  }
};
