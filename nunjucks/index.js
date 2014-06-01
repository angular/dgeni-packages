var Package = require('dgeni').Package;

/**
 * @dgPackage nunjucks
 * @description Provides a template engine powered by Nunjucks
 */
module.exports = new Package('nunjucks', ['base'])

.service('nunjucksConfig', require('.services/nunjucksConfig'))
.service('templateEngine', require('.services/nunjucks-template-engine'))

.config(function(config) {

  config.append('rendering.filters', require('./rendering/filters/change-case'));

  config.append('rendering.filters', [
    require('./rendering/filters/first-line'),
    require('./rendering/filters/first-paragraph'),
    require('./rendering/filters/json'),
    require('./rendering/filters/marked')
  ]);

  config.append('rendering.tags', [
    require('./rendering/tags/marked')
  ]);

});