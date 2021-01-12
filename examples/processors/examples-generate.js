const path = require('canonical-path');

/**
 * @dgProcessor generateExamplesProcessor
 * @description
 * Create doc objects of the various things that need to be rendered for an example.
 * This includes the files that will be run in an iframe, the code that will be injected
 * into the HTML pages and the protractor test files.
 */
module.exports = function generateExamplesProcessor(log, exampleMap) {

  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $validate: {
      deployments: { presence: true }
    },
    $process(docs) {
      exampleMap.forEach(example => {

        const stylesheets = [];
        const scripts = [];

        // The index file is special, see createExampleDoc()
        example.indexFile = example.files['index.html'];

        // Create a new document for each file of the example
        Object.entries(example.files).forEach(([fileName, file]) => {
          if ( fileName === 'index.html' ) return;

          const fileDoc = this.createFileDoc(example, file);
          docs.push(fileDoc);

          // Store a reference to the fileDoc for attaching to the exampleDocs
          if ( file.type == 'css' ) {
            stylesheets.push(fileDoc);
          } else if ( file.type == 'js' ) {
            scripts.push(fileDoc);
          }
        });

        // Create an index.html document for the example (one for each deployment type)
        this.deployments.forEach(deployment => {
          const exampleDoc = this.createExampleDoc(example, deployment, stylesheets, scripts);
          docs.push(exampleDoc);
          example.deployments[deployment.name] = exampleDoc;
        });

        // Create the doc that will be injected into the website as a runnable example
        const runnableExampleDoc = this.createRunnableExampleDoc(example);
        docs.push(runnableExampleDoc);
        example.runnableExampleDoc = runnableExampleDoc;

        // Create the manifest that will be sent to Plunker
        docs.push(this.createManifestDoc(example));

      });
    },

    createExampleDoc(example, deployment, stylesheets, scripts) {
      const deploymentQualifier = deployment.name === 'default' ? '' : ('-' + deployment.name);
      const commonFiles = (deployment.examples && deployment.examples.commonFiles) || {};
      const dependencyPath = (deployment.examples && deployment.examples.dependencyPath) || '.';

      const exampleDoc = {
        id: example.id + deploymentQualifier,
        deployment: deployment,
        deploymentQualifier: deploymentQualifier,
        docType: 'example',
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        template: 'index.template.html'
      };

      // Copy in the common scripts and stylesheets
      exampleDoc.scripts = (commonFiles.scripts || []).map(script => ({ path: script }));
      exampleDoc.stylesheets = (commonFiles.stylesheets || []).map(stylesheet => ({ path: stylesheet }));

      // Copy in any dependencies for this example
      if ( example.deps ) {
        example.deps.split(';').forEach(dependency => {
          const filePath = /(https?:)?\/\//.test(dependency) ?
            dependency :
            /(https?:)?\/\//.test(dependencyPath) ?
              dependencyPath + dependency :
              path.join(dependencyPath, dependency);
          if ( filePath.match(/\.js$/) ) {
            exampleDoc.scripts.push({ path: filePath });
          } else if ( filePath.match(/\.css$/) ) {
            exampleDoc.stylesheets.push({ path: filePath });
          }
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

    createFileDoc(example, file) {
      const fileDoc = {
        docType: 'example-file',
        id: example.id + '/' + file.name,
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        template: 'template.' + file.type,
        fileContents: file.fileContents,
        path: file.name
      };
      return fileDoc;
    },

    createRunnableExampleDoc(example) {
      const exampleDoc = {
        id: example.id + '-runnableExample',
        docType: 'runnableExample',
        fileInfo: example.doc.fileInfo,
        startingLine: example.doc.startingLine,
        endingLine: example.doc.endingLine,
        example: example,
        template: 'inline/runnableExample.template.html'
      };
      return exampleDoc;
    },

    createManifestDoc(example) {

      const files = Object.values(example.files)
        .filter(file => file.name !== 'index.html')
        .map(file => file.name);

      const manifestDoc = {
        id: example.id + '/manifest.json',
        docType: 'example-file',
        example: example,
        template: 'manifest.template.json',
        files: files
      };
      return manifestDoc;
    }
  };
};