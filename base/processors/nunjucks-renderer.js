var _ = require('lodash');
var path = require('canonical-path');
var nunjucks = require('nunjucks');
var log = require('winston');
var templateFinderFactory = require('../../utils/template-finder');

var plugin = module.exports = {
  name: 'nunjucks-renderer',
  runAfter: ['rendering-docs'],
  runBefore: ['docs-rendered'],
  exports: {

    templateFinder: ['factory', function(config) {
      return templateFinderFactory(config);
    }],

    templateEngine: ['factory', function(config) {

      if ( !config.basePath ) {
        throw new Error('Invalid configuration: You must provide a basePath in the configuration object');
      }

      if ( !config.rendering || !config.rendering.templateFolders ) {
        throw new Error('Invalid configuration: You must provide config.rendering.templateFolders array');
      }


      // Resolve the paths to the templates and output folder
      var templateFolders = _.map(config.rendering.templateFolders, function(templateFolder) {
        return path.resolve(config.basePath, templateFolder);
      });


      // Set any options on the nunjucks engine, such as using {$ $} for nunjucks interpolation
      // rather than {{ }}, which conflicts with AngularJS
      var loader = new nunjucks.FileSystemLoader(templateFolders, true);
      var nunjucksConfig = config.get('rendering.nunjucks.config', {});
      var engine = new nunjucks.Environment(loader, nunjucksConfig);


      // Configure nunjucks with the custom filters
      _.forEach(config.rendering.filters, function(filter) {
        engine.addFilter(filter.name, filter.process);
      });


      // Configure nunjucks with the custom tags
      _.forEach(config.rendering.tags, function(tag) {
        engine.addExtension(tag.tags[0], tag);
      });

      return engine;
    }]
  },
  /**
   * Render the set of documents to the output folder and extra data, using the templates found in the given folder
   * @param  {object} docs             The documents to render
   * @param {Config} config            The Dgeni configuration object
   * @param {object} extraData         All the injectable components in the base injector
   * @param {object} templateFinder    A helper that can match docs to templates
   * @param {object} templateEngine    The engine that will render the docs/templates
   */
  process: function render(docs, config, extraData, templateFinder, templateEngine) {

    // Extract any extra helper functions/data from the config
    var helpers = _.defaults(Object.create(null), config.rendering.helpers);


    _.forEach(docs, function(doc) {
      log.debug('Rendering doc', doc.id, doc.name);
      var data, res, err;
      try {
        data = _.defaults(Object.create(null), { doc: doc, docs: docs }, extraData, helpers);
        var templateFile = templateFinder(data.doc);
        doc.renderedContent = templateEngine.render(templateFile, data);
      } catch(ex) {
        console.log(_.omit(doc, ['content', 'moduleDoc', 'components', 'serviceDoc', 'providerDoc']));
        throw new Error('Failed to render doc "' + doc.id + '" from file "' + doc.file + '" line ' + doc.startingLine + '\n Error Message follows:\n' + ex.stack);
      }
    });

  }
};
