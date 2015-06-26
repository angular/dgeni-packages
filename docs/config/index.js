// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var projectPath = path.resolve(__dirname, '../..');
var packagePath = __dirname;

var Package = require('dgeni').Package;

module.exports = new Package('dgeni-docs', [
  require(path.resolve(projectPath, 'jsdoc')),
  require(path.resolve(projectPath, 'dgeni')),
  require(path.resolve(projectPath, 'nunjucks'))
])

.processor(require('./processors/readDgeniDocs'))

.config(function (readFilesProcessor, writeFilesProcessor) {
  readFilesProcessor.basePath = projectPath;

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
      ],
      basePath: projectPath },
  ];

  writeFilesProcessor.outputFolder = '.tmp/docs';
})

.config(function (templateFinder, templateEngine) {
  templateFinder.templateFolders = [path.resolve(packagePath, 'template')];

  // templateFinder.templatePatterns.unshift('${doc.template}');
  templateFinder.templatePatterns.unshift('${doc.docType}.template.html');

  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };
})

;
