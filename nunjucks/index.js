var Package = require('dgeni').Package;

/**
 * @dgPackage nunjucks
 * @description Provides a template engine powered by Nunjucks
 */
module.exports = new Package('nunjucks', ['base'])

.factory(require('./services/nunjucks-template-engine'))

.config(function(templateEngine) {
  templateEngine.tags.push(require('./rendering/tags/marked'));
  templateEngine.tags = templateEngine.tags
    .concat(require('./rendering/filters/change-case'))
    .concat([
      require('./rendering/filters/first-line'),
      require('./rendering/filters/first-paragraph'),
      require('./rendering/filters/json'),
      require('./rendering/filters/marked')
    ]);
});
