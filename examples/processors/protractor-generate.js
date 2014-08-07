"use strict";

var _ = require('lodash');
var path = require('canonical-path');

/**
 * dgProcessor generateProtractorTestsProcessor
 * @description
 * Generate a protractor test files from the e2e tests in the examples
 */
module.exports = function generateProtractorTestsProcessor(examples) {
  return {
    deployments: [],
    $validate: {
      deployments: { presence: true },
    },
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function(docs) {

      var deployments = this.deployments;

      _.forEach(examples, function(example) {
        _.forEach(example.files, function(file) {

          // Check if it's a Protractor test.
          if (file.type === 'protractor') {

            _.forEach(deployments, function(deployment) {
              docs.push(createProtractorDoc(example, deployment, file));
            });
          }

        });
      });
    }
  };
};

function createProtractorDoc(example, deployment, file) {
  return {
    docType: 'e2e-test',
    id: 'protractorTest' + '-' + example.id + '-' + deployment.name,
    example: example,
    deployment: deployment,
    template: 'protractorTests.template.js',
    innerTest: file.fileContents
  };
}