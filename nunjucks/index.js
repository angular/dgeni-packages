/**
 * @dgPackage nunjucks
 * @description Provides a template engine powered by Nunjucks
 */
module.exports = function(config) {

  config.append('processing.processors', require('./nunjucks-template-engine'));

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

};