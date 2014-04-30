/**
 * @dgPackage nunjucks
 * @description Provides a template engine powered by Nunjucks
 */
module.exports = function(config) {

  config.append('processing.processors', [ { name: 'nunjucks-template-engine' } ]);

};