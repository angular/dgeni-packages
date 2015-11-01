// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');
var Package = require('dgeni').Package;

module.exports = new Package('dgeni-docs', [require('../dgeni')])

.config(function (readFilesProcessor, writeFilesProcessor) {
  readFilesProcessor.basePath = path.resolve(__dirname, '..');

  readFilesProcessor.sourceFiles = [
    {
      include: [
        '*/*.js',
        '*/processors/**.js',
        '*/services/**.js',
        '*/file-readers/**.js',
        '*/tag-defs/**.js',
        '*/rendering/**.js'
      ],
      exclude: [
        'docs',
        '**/*.spec.js',
        '**/*.template.js'
      ]
    },
  ];

  writeFilesProcessor.outputFolder = '.tmp/docs';
})

.config(function(computePathsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['dgPackage', 'indexPage'],
    pathTemplate: '${id}.md',
    outputPathTemplate: '${path}'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['dgProcessor'],
    pathTemplate: '${packageDoc.id}/processors/${name}.md',
    outputPathTemplate: '${path}'
  });
  computePathsProcessor.pathTemplates.push({
    docTypes: ['dgService'],
    pathTemplate: '${packageDoc.id}/services/${name}.md',
    outputPathTemplate: '${path}'
  })
})

.config(function (templateFinder, templateEngine) {
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.id }.${ doc.docType }.template.md',
    '${ doc.id }.template.md',
    '${ doc.docType }.template.md'
  ].concat(templateEngine.templatePatterns);

  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };
})

.config(function(getLinkInfo) {
  getLinkInfo.relativeLinks = true;
})

.config(function(debugDumpProcessor) {
  debugDumpProcessor.$enabled = true;
});

