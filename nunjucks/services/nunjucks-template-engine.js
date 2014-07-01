var nunjucks = require('nunjucks');
var _ = require('lodash');

/**
 * @dgService nunjucksTemplateEngine
 * @description A nunjucks powered template rendering engine
 */
module.exports = function nunjucksTemplateEngine(
                              templateFolders, nunjucksConfig, nunjucksFilters, nunjucksTags) {

  // Set any options on the nunjucks engine, such as using {$ $} for nunjucks interpolation
  // rather than {{ }}, which conflicts with AngularJS
  var loader = new nunjucks.FileSystemLoader(templateFolders, true);
  var engine = new nunjucks.Environment(loader, nunjucksConfig);


  // Configure nunjucks with the custom filters
  _.forEach(nunjucksFilters, function(filter) {
    engine.addFilter(filter.name, filter.process);
  });


  // Configure nunjucks with the custom tags
  _.forEach(nunjucksTags, function(tag) {
    engine.addExtension(tag.tags[0], tag);
  });

  return engine;
};