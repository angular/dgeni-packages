module.exports = function(config) {

  var processors =  config.append('processing.processors', [
    { name: 'reading-files' },
    { name: 'files-read', runAfter: ['reading-files'] },
    { name: 'processing-docs', runAfter: ['files-read'] },
    { name: 'docs-processed', runAfter: ['processing-docs'] },
    { name: 'adding-extra-docs', runAfter: ['docs-processed'] },
    { name: 'extra-docs-added', runAfter: ['adding-extra-docs'] },
    { name: 'rendering-docs', runAfter: ['extra-docs-added'] },
    { name: 'docs-rendered', runAfter: ['rendering-docs'] },
    { name: 'writing-files', runAfter: ['docs-rendered'] },
    { name: 'files-written', runAfter: ['writing-files'] }
  ]);


  config.append('processing.processors', [
    require('./processors/code-name'),
    require('./processors/read-files'),
    require('./processors/render-docs'),
    require('./processors/templateFinder'),
    require('./processors/unescape-comments'),
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