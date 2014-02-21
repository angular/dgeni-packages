var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
var trimIndentation = require('dgeni/lib/utils/trim-indentation');
var code = require('dgeni/lib/utils/code');
var templateFolder, deployments;


function outputPath(example, fileName) {
  return path.join(example.outputFolder, fileName);
}

function createExampleDoc(example, deployment, stylesheets, scripts) {
  var deploymentQualifier = deployment.name === 'default' ? '' : ('-' + deployment.name);
  var commonFiles = (deployment.examples && deployment.examples.commonFiles) || {};
  var dependencyPath = deployment.examples.dependencyPath || '.';

  var exampleDoc = {
    id: example.id + deploymentQualifier,
    docType: 'example',
    template: path.join(templateFolder, 'index.template.html'),
    file: example.doc.file,
    startingLine: example.doc.startingLine,
    example: example,
    path: example.id + deploymentQualifier,
    outputPath: example.outputFolder + '/index' + deploymentQualifier + '.html'
  };

  // Copy in the common scripts and stylesheets
  exampleDoc.scripts = _.map(commonFiles.scripts, function(script) { return { path: script }; });
  exampleDoc.stylesheets = _.map(commonFiles.stylesheets || [], function(stylesheet) { return { path: stylesheet }; });

  // Copy in any dependencies for this example
  if ( example.deps ) {
    _.forEach(example.deps.split(';'), function(dependency) {
      var filePath = /(https?:)?\/\//.test(dependencyPath) ?
        dependencyPath + dependency :
        path.join(dependencyPath, dependency);
      exampleDoc.scripts.push({ path: filePath });
    });
  }

  // Attach the specific scripts and stylesheets for this example
  exampleDoc.stylesheets = exampleDoc.stylesheets.concat(stylesheets);
  exampleDoc.scripts = exampleDoc.scripts.concat(scripts);

  // If there is content specified for the index.html file then use its contents for this doc
  if ( example.indexFile ) {
    exampleDoc.fileContents = example.indexFile.fileContents;
  }

  return exampleDoc;
}

function createFileDoc(example, file) {
  var fileDoc = {
    docType: 'example-' + file.type,
    id: example.id + '/' + file.name,
    template: path.join(templateFolder, 'template.' + file.type),
    file: example.doc.file,
    startingLine: example.doc.startingLine,
    example: example,
    path: file.name,
    outputPath: outputPath(example, file.name),
    fileContents: file.fileContents
  };
  return fileDoc;
}


module.exports = {
  name: 'examples-generate',
  description: 'Search the documentation for examples that need to be extracted',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  init: function(config, injectables) {
    exampleNames = {};

    deployments = config.get('deployment.environments');
    if ( !deployments ) {
      throw new Error('No deployment environments found in the config.');
    }

    templateFolder = config.get('processing.examples.templateFolder', 'examples');
  },
  process: function(docs, examples) {
    _.forEach(examples, function(example) {

      var stylesheets = [];
      var scripts = [];

      // We don't want to create a file for index.html, since that will be covered by the exampleDoc
      example.indexFile = example.files['index.html'];
      delete example.files['index.html'];

      // Create a new document for each file of the example
      _.forEach(example.files, function(file) {

        var fileDoc = createFileDoc(example, file);
        docs.push(fileDoc);

        // Store a reference to the fileDoc for attaching to the exampleDocs
        if ( file.type == 'css' ) {
          stylesheets.push(fileDoc);
        } else if ( file.type == 'js' ) {
          scripts.push(fileDoc);
        }
      });

      // Create a new document for the example (for each deployment)
      _.forEach(deployments, function(deployment) {
        var exampleDoc = createExampleDoc(example, deployment, stylesheets, scripts);
        docs.push(exampleDoc);
      });
    });
  }
};
