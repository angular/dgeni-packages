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
      examples.forEach(function(example) {

        var stylesheets = [];
        var scripts = [];

        // The index file is special, see createExampleDoc()
        example.indexFile = example.files['index.html'];

        // Create a new document for each file of the example
        _(example.files)
        // We don't want to create a file for index.html, see createExampleDoc()
        .omit('index.html')
        .forEach(function(file) {

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

    outputPath: function(example, fileName) {
      return path.join(example.outputFolder, fileName);
    },

    createExampleDoc: function(example, deployment, stylesheets, scripts) {
      var deploymentQualifier = deployment.name === 'default' ? '' : ('-' + deployment.name);
      var commonFiles = (deployment.examples && deployment.examples.commonFiles) || {};
      var dependencyPath = (deployment.examples && deployment.examples.dependencyPath) || '.';

      var exampleDoc = {
        id: example.id + deploymentQualifier,
        docType: 'example',
        template: path.join(this.templateFolder, 'index.template.html'),
        file: example.doc.fileInfo.filePath,
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
    },

    createFileDoc: function(example, file) {
      var fileDoc = {
        docType: 'example-' + file.type,
        id: example.id + '/' + file.name,
        template: path.join(this.templateFolder, 'template.' + file.type),
        file: example.doc.fileInfo.filePath,
        startingLine: example.doc.startingLine,
        example: example,
        path: file.name,
        outputPath: this.outputPath(example, file.name),
        fileContents: file.fileContents
      };
      return fileDoc;
    },

    createRunnableExampleDoc: function(example) {
      var exampleDoc = {
        id: example.id + '-runnableExample',
        docType: 'runnableExample',
        file: example.doc.file,
        startingLine: example.doc.startingLine,
        example: example
      };
      return exampleDoc;
    },

    createManifestDoc: function(example) {

      var files = _(example.files)
        .omit('index.html')
        .map(function(file) {
          return file.name;
        })
        .value();

      var manifestDoc = {
        id: example.id + '-manifest',
        docType: 'example-manifest',
        template: path.join(this.templateFolder, 'manifest.template.json'),
        file: example.doc.file,
        startingLine: example.doc.startingLine,
        example: example,
        files: files,
        outputPath: this.outputPath(example, 'manifest.json')
      };
      return manifestDoc;
    }
  };
};