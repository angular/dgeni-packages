require('es6-shim');
var _ = require('lodash');

/**
 * @dgProcessor renderDoc
 * @description
 * Render the set of documents using the provided `templateEngine`, to `doc.renderedContent`
 * using the `extraData`, `helpers` and the templates found by `templateFinder`.
 *
 * @param {TemplateEngine} templateEngine    The engine that will render the docs/templates. The
 *                                           base package doesn't provide a default templateEngine.
 *                                           There is a Nunjucks based engine in the nunjucks module.
 * @param {TemplateFinder} templateFinder    A service that matches templates to docs.  A default
 *                                           templateFinder is provided in this base package.
 *
 * @property {Map} extraData      Extra data that will be passed to the rendering engine. Your
 *                                services and processors can add data to this object to be made
 *                                available in templates when they are rendered.
 * @property {Map} helpers        Extra helper functions that will be passed to the rendering engine.
 *                                Your services and processors can add helper functions to this
 *                                object to be made available in templates when they are rendered.
 */
module.exports = function renderDocsProcessor(log, templateFinder, templateEngine) {
  return {
    helpers: new Map(),
    extraData: new Map(),

    $runAfter: ['rendering-docs'],
    $runBefore: ['docs-rendered'],
    $validate: {
      helpers: { presence: true },
      extraData: { presence: true }
    },
    $process: function render(docs) {

      _.forEach(docs, function(doc) {
        log.debug('Rendering doc', doc.id, doc.name);
        try {
          var data = _.defaults(Object.create(null),
            { doc: doc, docs: docs },
            this.extraData,
            this.helpers);
          var templateFile = templateFinder(data.doc);
          doc.renderedContent = templateEngine.render(templateFile, data);
        } catch(ex) {
          console.log(_.omit(doc, ['content', 'moduleDoc', 'components', 'serviceDoc', 'providerDoc']));
          throw new Error('Failed to render doc "' + doc.id + '"' +
            ' from file "' + doc.file + '" line ' + doc.startingLine + '\n' +
            'Error Message follows:\n' + ex.stack);
        }
      });

    }
  };
};