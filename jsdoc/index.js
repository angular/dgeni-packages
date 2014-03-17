module.exports = function(config) {

  config.append('source.extractors', require('./extractors/jsdoc'));
  
  config.append('processing.processors', [
    require('./processors/doc-extractor'),
    require('./processors/tag-parser'),
    require('./processors/tag-extractor'),
    require('./processors/compute-path'),
    require('./processors/nunjucks-renderer'),
    require('./processors/escaped-comments'),
    require('./processors/inline-tags'),
    require('./processors/write-files')
  ]);
  
  config.append('processing.tagDefinitions', require('./tag-defs'));
  
  config.append('rendering.filters', [
    require('./rendering/filters/dash-case'),
    require('./rendering/filters/first-line'),
    require('./rendering/filters/first-paragraph'),
    require('./rendering/filters/json'),
    require('./rendering/filters/marked')
  ]);

  config.append('rendering.tags', [
    require('./rendering/tags/marked')
  ]);

  return config;
};