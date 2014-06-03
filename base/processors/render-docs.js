require('es6-shim');
var _ = require('lodash');

/**
 * @dgProcessor renderDoc
 * @description
 * Render the set of documents using the provided `templateEngine`, to `doc.renderedContent`
 * using the `extraData`, `helpers` and the templates found by `templateFinder`.
 *
 * @param {object} templateEngine    The engine that will render the docs/templates
 * @param {object} templateFinder    A helper that matches templates to docs
 *
 * @property {object} extraData      Extra data that will be passed to the rendering engine
 * @property {object} helpers        Extra functions that will be passed to the rendering engine
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