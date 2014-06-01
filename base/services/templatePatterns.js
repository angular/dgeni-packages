module.exports = function templatePatternsFactory(config) {
  var templatePatterns = config.get('templateFinder.templatePatterns');
  if ( !templatePatterns ) {
    throw new Error('Invalid configuration.  You must provide "templateFinder.templatePatterns".');
  }
  return templatePatterns;
};