"use strict";

/**
 * @dgProcessor generateProtractorTestsProcessor
 * @description
 * Generate a protractor test files from the e2e tests in the examples
 */
module.exports = function generateProtractorTestsProcessor(exampleMap) {
  return {
    deployments: [],
    basePath: '',
    $validate: {
      deployments: { presence: true },
    },
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process(docs) {

      const deployments = this.deployments;
      const basePath = this.basePath;

      exampleMap.forEach(example => {
        Object.values(example.files || {}).forEach(file => {
          // Check if it's a Protractor test.
          if (file.type === 'protractor') {
            deployments.forEach(deployment => docs.push(createProtractorDoc(example, deployment, file, basePath)));
          }
        });
      });
    }
  };
};

function createProtractorDoc(example, deployment, file, basePath) {
  return {
    docType: 'e2e-test',
    id: 'protractorTest' + '-' + example.id + '-' + deployment.name,
    example: example,
    deployment: deployment,
    template: 'protractorTests.template.js',
    innerTest: file.fileContents,
    'ng-app-included': example['ng-app-included'],
    basePath: basePath
  };
}