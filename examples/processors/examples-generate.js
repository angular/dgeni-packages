var _ = require('lodash');
var log = require('winston');
var path = require('canonical-path');
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
    path: example.outputFolderPath + '/index' + deploymentQualifier + '.html',
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
    path: example.outputFolderPath + '/' + file.name,
    outputPath: outputPath(example, file.name),
    fileContents: file.fileContents
  };
  return fileDoc;
}

function createRunnableExampleDoc(example) {
  var exampleDoc = {
    id: example.id + '-runnableExample',
    docType: 'runnableExample',
    file: example.doc.file,
    startingLine: example.doc.startingLine,
    example: example,
    path: example.outputFolderPath + '/' + example.doc.file,
    outputPath: example.outputFolder + '/' + example.doc.file
  };
  return exampleDoc;
}

function createManifestDoc(example) {

  var files = _(example.files)
    .omit('index.html')
    .map(function(file) {
      return file.name;
    })
    .value();

  var manifestDoc = {
    id: example.id + '-manifest',
    docType: 'example-manifest',
    template: path.join(templateFolder, 'manifest.template.json'),
    file: example.doc.file,
    startingLine: example.doc.startingLine,
    example: example,
    files: files,
    outputPath: outputPath(example, 'manifest.json')
  };
  return manifestDoc;
}

module.exports = {
  name: 'examples-generate',
  description: 'Create doc objects of the various things that need to be rendered for an example.\n' +
               'This includes the files that will be run in an iframe, the code that will be injected' +
               'into the HTML pages and the protractor test files',
  runAfter: ['adding-extra-docs'],
  runBefore: ['extra-docs-added'],
  process: function(docs, examples, config) {

    deployments = config.get('deployment.environments');
    if ( !deployments ) {
      throw new Error('No deployment environments found in the config.');
    }

    templateFolder = config.get('processing.examples.templateFolder', 'examples');

    _.forOwn(examples, function(example) {

      var stylesheets = [];
      var scripts = [];

      // The index file is special, see createExampleDoc()
      example.indexFile = example.files['index.html'];

      // Create a new document for each file of the example
      _(example.files)
      // We don't want to create a file for index.html, see createExampleDoc()
      .omit('index.html')
      .forEach(function(file) {

        var fileDoc = createFileDoc(example, file);
        docs.push(fileDoc);

        // Store a reference to the fileDoc for attaching to the exampleDocs
        if ( file.type == 'css' ) {
          stylesheets.push(fileDoc);
        } else if ( file.type == 'js' ) {
          scripts.push(fileDoc);
        }
      });

      // Create an index.html document for the example (one for each deployment type)
      _.forEach(deployments, function(deployment) {
        var exampleDoc = createExampleDoc(example, deployment, stylesheets, scripts);
        docs.push(exampleDoc);
      });

      // Create the doc that will be injected into the website as a runnable example
      var runnableExampleDoc = createRunnableExampleDoc(example);
      docs.push(runnableExampleDoc);
      example.runnableExampleDoc = runnableExampleDoc;

      // Create the manifest that will be sent to Plunker
      docs.push(createManifestDoc(example));

    });
  }
};
