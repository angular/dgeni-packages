var Package = require('dgeni').Package;

/**
 * @dgPackage nunjucks
 * @description Provides a template engine powered by Nunjucks
 */
module.exports = new Package('nunjucks', ['base'])

.factory(require('./services/nunjucksConfig'))
.factory(require('./services/nunjucksTags'))
.factory(require('./services/nunjucksFilters'))
.factory('templateEngine', require('./services/nunjucks-template-engine'))

.config(function(nunjucksTags) {
  nunjucksTags.push(require('./rendering/tags/marked'));
})

.config(function(nunjucksFilters) {

  nunjucksFilters = nunjucksFilters
    .concat(require('./rendering/filters/change-case'))
    .concat([
      require('./rendering/filters/first-line'),
      require('./rendering/filters/first-paragraph'),
      require('./rendering/filters/json'),
      require('./rendering/filters/marked')
    ]);

});
