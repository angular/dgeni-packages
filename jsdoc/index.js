module.exports = function(config) {

  require('../base')(config);
  require('../nunjucks')(config);

  config.append('source.extractors', require('./extractors/jsdoc'));

  config.append('processing.processors', [
    { name: 'parsing-tags', runAfter: ['files-read'], runBefore: ['processing-docs'] },
    { name: 'tags-parsed', runAfter: ['parsing-tags'], runBefore: ['processing-docs'] },
    { name: 'extracting-tags', runAfter: ['tags-parsed'], runBefore: ['processing-docs'] },
    { name: 'tags-extracted', runAfter: ['extracting-tags'], runBefore: ['processing-docs'] }
  ]);


  config.append('processing.processors', [
    require('./processors/tag-parser'),
    require('./processors/tag-extractor'),
    require('./processors/compute-path'),
    require('./processors/inline-tags')
  ]);

  config.append('processing.tagDefinitions', require('./tag-defs'));

  return config;
};