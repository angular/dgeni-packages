module.exports = function(config) {

  require('../base')(config);

  config.append('source.fileReaders', require('./file-readers/jsdoc'));

  config.append('processing.processors', [
    { name: 'parsing-tags', runAfter: ['files-read'], runBefore: ['processing-docs'] },
    { name: 'tags-parsed', runAfter: ['parsing-tags'], runBefore: ['processing-docs'] },
    { name: 'extracting-tags', runAfter: ['tags-parsed'], runBefore: ['processing-docs'] },
    { name: 'tags-extracted', runAfter: ['extracting-tags'], runBefore: ['processing-docs'] }
  ]);


  config.append('processing.processors', [
    require('./processors/code-name'),
    require('./processors/tagDefinitions'),
    require('./processors/tagParser'),
    require('./processors/tagExtractor'),
    require('./processors/defaultTagTransforms'),
    require('./processors/parse-tags'),
    require('./processors/extract-tags'),
    require('./processors/compute-path'),
    require('./processors/inline-tags')
  ]);

  config.append('processing.tagDefinitions', require('./tag-defs'));

  config.append('processing.defaultTagTransforms', require('./tag-defs/transforms/trim-whitespace'));

  return config;
};