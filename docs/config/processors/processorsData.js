
var _ = require('lodash');
var path = require('canonical-path');
var Dgeni = require('dgeni');
// var inspect = require('eyes').inspector({ stream: null });

var projectPath = path.resolve(__dirname, '../../..');
var packagePath = __dirname;

// Get the `sortByDependency` function from Dgeni. We'll use this to figure out processor order
var sortByDependency = require(path.resolve(projectPath, 'node_modules/dgeni/lib/util/dependency-sort'));

// Brind in the test package. All the various processors and placeholders will be in this
var TestPackage = new Dgeni([ require('../testPackage') ]);

module.exports = function processorsData() {
  return {
    $runAfter: ['adding-extra-docs'],
    $runBefore: ['extra-docs-added'],
    $process: function (docs) {
      // Get processors
      var processors = docs.filter(function (doc) {
        // return hasTagPrefix(doc, 'dg');
        return doc.hasOwnProperty('dgProcessor');
      });

      var processors = _.map(processors, function(p) {
        p.readableName = p.codeName.replace(/Processor$/, '');
        p.dgPackage = (p.fileInfo.projectRelativePath.split(/\//))[0];
        p.dgType = 'processor';
        return _.pick(p, ['name', 'readableName', 'dgPackage', 'path', 'area', 'codeName', 'description', 'docType']);
      });

      // Get packages from the Test Package
      TestPackage.configureInjector();

      // Sort the processors according to their $runAfter and $runBefore settings
      var testPackageProcessors = sortByDependency(TestPackage.processors, '$runAfter', '$runBefore');

      // Get the $package property and sort index for each processor
      testPackageProcessors.forEach(function (testProc, i) {
        // console.log(testProc.name, '-', testProc.$package);

        var matchingProc = _.find(processors, { codeName: testProc.name });

        // Processor is a placeholder; it has no $process method. Need to put in a record for it
        if (!matchingProc) {
          matchingProc = {
            name: testProc.name,
            readableName: testProc.name.replace(/Processor$/, ''),
            dgPackage: testProc.$package
          };
          processors.push(matchingProc);
        }
        if (!testProc.$process) {
          matchingProc.placeholder = true;
        }

        matchingProc.$package = testProc.$package;
        matchingProc.index = i;
      });

      docs.push({
        docType: 'json',
        id: 'processors-data',
        name: 'PROCESSORS',
        template: 'constant-data.template.js',
        outputPath: 'js/processors-data.js',
        items: processors
      });
    }
  };
}

function hasTagPrefix(doc, prefix) {
  return doc.tags.tags.some(function (tag) {
    return tag.tagName.indexOf(prefix) === 0;
  });
}
