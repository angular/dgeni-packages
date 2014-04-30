var nunjucks = require('nunjucks');
var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgProcessor nunjucks-template-engine
 * @description A nunjucks powered template rendering engine
 */
module.exports = {
  name: 'nunjucks-template-engine',
  exports: {

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
  }
};