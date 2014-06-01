module.exports = function nunjucksConfigFactory(config) {
  return config.get('rendering.nunjucks.config', {});
};