var _ = require('lodash');
var path = require('canonical-path');

/**
 * @dgProcessor generateExamplesProcessor
 * @description
 * Create doc objects of the various things that need to be rendered for an example
 * This includes the files that will be run in an iframe, the code that will be injected
 * into the HTML pages and the protractor test files.
 */
module.exports = function generateExamplesProcessor(log, examples) {

  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $validate: {
      deployments: { presence: true },
      templateFolder: { presence: true}
    },
    $process: function(docs) {
      _.forEach(examples, function(example) {

        var stylesheets = [];
        var scripts = [];

        // The index file is special, see createExampleDoc()
        example.indexFile = example.files['index.html'];

        // Create a new document for each file of the example
        _.forEach(example.files, function(file, fileName) {
          if ( fileName === 'index.html' ) return;

          var fileDoc = this.createFileDoc(example, file);
          docs.push(fileDoc);

          // Store a reference to the fileDoc for attaching to the exampleDocs
          if ( file.type == 'css' ) {
            stylesheets.push(fileDoc);
          } else if ( file.type == 'js' ) {
            scripts.push(fileDoc);
          }
        }, this);

        // Create an index.html document for the example (one for each deployment type)
        _.forEach(this.deployments, function(deployment) {
          var exampleDoc = this.createExampleDoc(example, deployment, stylesheets, scripts);
          docs.push(exampleDoc);
        }, this);

        // Create the doc that will be injected into the website as a runnable example
        var runnableExampleDoc = this.createRunnableExampleDoc(example);
        docs.push(runnableExampleDoc);
        example.runnableExampleDoc = runnableExampleDoc;

        // Create the manifest that will be sent to Plunker
        docs.push(this.createManifestDoc(example));

      }, this);
    },

    createExampleDoc: function(example, deployment, stylesheets, scripts) {
      var deploymentQualifier = deployment.name === 'default' ? '' : ('-' + deployment.name);
      var commonFiles = (deployment.examples && deployment.examples.commonFiles) || {};
      var dependencyPath = (deployment.examples && deployment.examples.dependencyPath) || '.';

      var exampleDoc = {
        id: example.id + deploymentQualifier,
        deployment: deploymentQualifier,
        docType: 'example',
        template: path.join(this.templateFolder, 'index.template.html'),
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
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
    },

    createFileDoc: function(example, file) {
      var fileDoc = {
        docType: 'example-' + file.type,
        id: example.id + '/' + file.name,
        template: path.join(this.templateFolder, 'template.' + file.type),
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        fileContents: file.fileContents
      };
      return fileDoc;
    },

    createRunnableExampleDoc: function(example) {
      var exampleDoc = {
        id: example.id + '-runnableExample',
        docType: 'runnableExample',
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example
      };
      return exampleDoc;
    },

    createManifestDoc: function(example) {

      var files = _.keys(example.files);

      var manifestDoc = {
        id: example.id + '/manifest.json',
        docType: 'example-manifest',
        template: path.join(this.templateFolder, 'manifest.template.json'),
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        files: files,
      };
      return manifestDoc;
    }
  };
};