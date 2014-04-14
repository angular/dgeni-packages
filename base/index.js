module.exports = function(config) {

  var processors =  config.append('processing.processors', [
    { name: 'loading-files' },
    { name: 'files-loaded', runAfter: ['loading-files'] },
    { name: 'processing-docs', runAfter: ['loading-files'] },
    { name: 'docs-processed', runAfter: ['processing-docs'] },
    { name: 'adding-extra-docs', runAfter: ['docs-processed'] },
    { name: 'extra-docs-added', runAfter: ['adding-extra-docs'] },
    { name: 'rendering-docs', runAfter: ['extra-docs-added'] },
    { name: 'docs-rendered', runAfter: ['rendering-docs'] },
    { name: 'writing-files', runAfter: ['docs-rendered'] },
    { name: 'files-written', runAfter: ['writing-files'] }
  ]);


  config.append('processing.processors', [
    require('./processors/doc-extractor'),
    require('./processors/name-from-code'),
    require('./processors/nunjucks-renderer'),
    require('./processors/escaped-comments'),
    require('./processors/write-files')
  ]);

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

  return config;
};