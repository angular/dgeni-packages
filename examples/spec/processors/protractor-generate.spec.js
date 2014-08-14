var generateProtractorTestsProcessorFactory = require('../../processors/protractor-generate');
var _ = require('lodash');
var StringMap = require('stringmap');

describe("generateExamplesProcessor", function() {
  var templateFolder, deployments, docs, exampleMap;

  beforeEach(function() {

    docs = [{ file: 'a.b.js' }];

    exampleMap = new StringMap();

    files = {};

    files['index.html'] = { type: 'html', name: 'index.html', fileContents: 'index.html content' };
    files['app.js'] = { type: 'js', name: 'app.js', fileContents: 'app.js content' };
    files['app.css'] = { type: 'css', name: 'app.css', fileContents: 'app.css content' };
    files['app.scenario.js'] = { type: 'protractor', name: 'app.scenario.js', fileContents: 'app.scenario.js content' };

    exampleMap.set('a.b.c', {
      id: 'a.b.c',
      doc: docs[0],
      outputFolder: 'examples',
      deps: 'dep1.js;dep2.js',
      files: files,
      deployments: {}
    });

    processor = generateProtractorTestsProcessorFactory(exampleMap);
    processor.templateFolder = 'examples';
    processor.deployments = [
      {
        name: 'default',
        examples: { commonFiles: [], dependencyPath: '.' },
      },
      {
        name: 'other',
        examples: { commonFiles: { scripts: [ 'someFile.js', 'someOtherFile.js' ], }, dependencyPath: '..' }
      }
    ];

    processor.$process(docs);

  });


  it("should add a protractor doc for each deployment in the example", function() {
    expect(_.filter(docs, { docType: 'e2e-test' })).toEqual([
      jasmine.objectContaining({
        docType: 'e2e-test',
        id: 'protractorTest-a.b.c-' + processor.deployments[0].name,
        example: exampleMap.get('a.b.c'),
        deployment: processor.deployments[0],
        template: 'protractorTests.template.js',
        innerTest: 'app.scenario.js content'
      }),
      jasmine.objectContaining({
        docType: 'e2e-test',
        id: 'protractorTest-a.b.c-' + processor.deployments[1].name,
        example: exampleMap.get('a.b.c'),
        deployment: processor.deployments[1],
        template: 'protractorTests.template.js',
        innerTest: 'app.scenario.js content'
      }),
    ]);
  });

});
